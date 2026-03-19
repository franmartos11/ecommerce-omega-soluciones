/* eslint-disable */
import { NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/app/lib/supabase/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

// Helper: check if a string is a valid UUID
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Normalize a cart item so `id` is always the product UUID.
// Cart items from variant products use id = `${productId}-${variantId}` (composite key).
// The DB trigger uses item->>'id' to update product stock, so it MUST be a pure UUID.
function normalizeCartItem(item: any) {
  // If productId is explicitly set and valid, use it as the id
  if (item.productId && isValidUUID(item.productId)) {
    return { ...item, id: item.productId };
  }
  // If id is already a plain UUID, no change needed
  if (item.id && isValidUUID(item.id)) {
    return item;
  }
  // If id looks like a composite key "uuid-uuid" (10 UUID parts)
  if (item.id && typeof item.id === 'string') {
    const parts = item.id.split('-');
    if (parts.length === 10) {
      const productId = parts.slice(0, 5).join('-');
      const variantId = parts.slice(5, 10).join('-');
      return { 
        ...item, 
        id: productId,
        productId: productId,
        variantId: item.variantId || variantId
      };
    }
  }
  return item;
}

// Read transfer discount from site config (server-side only, can't be tampered)
import { getConfig } from "@/lib/config.server";

async function getTransferDiscount(subtotal: number): Promise<number> {
  try {
    const cfg = await getConfig();
    const transfer = (cfg as any)?.payment_config?.transfer;
    if (!transfer?.discount_enabled || !transfer.discount_value) return 0;
    if (transfer.discount_type === "percentage") {
      return subtotal * (transfer.discount_value / 100);
    }
    return Math.min(transfer.discount_value, subtotal); // Clamp fixed discount
  } catch {
    return 0;
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin(); // Revert to admin client to bypass RLS for inserting orders
    const body = await req.json();

    if (!body || !body.cartItems || body.cartItems.length === 0) {
      return NextResponse.json(
        { error: "Carrito vacío o datos faltantes" },
        { status: 400 }
      );
    }

    // Normalize cart items so `id` is always a product UUID (required by DB trigger)
    const normalizedItems = body.cartItems.map(normalizeCartItem);

    // Collect all valid UUIDs to fetch true prices from DB
    const productIds = normalizedItems.map((item: any) => item.id).filter(isValidUUID);

    if (productIds.length === 0) {
      return NextResponse.json({ error: "No hay productos válidos en el carrito" }, { status: 400 });
    }

    // Fetch TRUE prices from the database to prevent client-side price manipulation
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds);

    if (dbError || !dbProducts) {
      return NextResponse.json({ error: "Error al verificar los precios de los productos" }, { status: 500 });
    }

    // Create a dictionary of real prices
    const realPrices = dbProducts.reduce((acc: any, prod: any) => {
      acc[prod.id] = prod.price;
      return acc;
    }, {});

    // Calculate subtotal using TRUE prices and update the items array with real prices
    let subtotal = 0;
    const finalItemsToSave = normalizedItems.map((item: any) => {
      const realPrice = realPrices[item.id];
      if (realPrice === undefined) {
        throw new Error(`Producto no encontrado en la base de datos: ${item.id}`);
      }
      subtotal += realPrice * item.quantity;
      return { ...item, price: realPrice }; // Overwrite malicious client prices
    });

    let discountAmount = 0;
    
    // Verificar y aplicar cupón si existe
    if (body.coupon && body.coupon.code) {
      const { data: couponDB } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', body.coupon.code)
        .eq('is_active', true)
        .single();
        
      if (couponDB) {
        // Verificar límites
        const isNotExpired = !couponDB.expires_at || new Date(couponDB.expires_at) >= new Date();
        const hasUsesLeft = couponDB.max_uses === null || couponDB.times_used < couponDB.max_uses;
        
        if (isNotExpired && hasUsesLeft) {
          if (couponDB.discount_type === 'percentage') {
             discountAmount = subtotal * (couponDB.discount_value / 100);
          } else {
             discountAmount = couponDB.discount_value;
          }
          
          // Guardar info del cupón en el JSON de shipping para referencia futura
          body.shippingData.coupon_code = couponDB.code;
          body.shippingData.discount_amount = discountAmount;
          
          // Incrementar uso del cupón
          await supabase
            .from('coupons')
            .update({ times_used: couponDB.times_used + 1 })
            .eq('id', couponDB.id);
        }
      }
    }

    const shippingCost = body.shippingCost || 0;
    
    // Apply transfer discount from site config (server-side, tamper-proof)
    let transferDiscountAmount = 0;
    if (body.paymentMethod === "transfer") {
      transferDiscountAmount = await getTransferDiscount(subtotal);
      if (transferDiscountAmount > 0 && body.shippingData) {
        body.shippingData.transfer_discount = transferDiscountAmount;
      }
    }

    const total = Math.max(0, subtotal - discountAmount - transferDiscountAmount) + shippingCost;


    // Preparar el documento de la orden
    const orderData = {
      status: "pendiente",
      payment_method: body.paymentMethod,
      total,
      items: finalItemsToSave,
      shipping: body.shippingData,
      user_email: body.shippingData?.email || "",
      reference: body.reference || null,
      receipt_url: body.receiptUrl || null,
      updated_at: new Date().toISOString(),
    };

    // Guardar en Supabase -> tabla "orders"
    let { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    // If the insert failed because receipt_url column doesn't exist yet (migration pending),
    // retry without it so the order still saves.
    if (error && (
      error.code === "42703" ||
      error.code === "PGRST204" ||
      (error.message && (error.message.includes("receipt_url") || error.message.includes("column")))
    )) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { receipt_url: _r, ...orderDataWithoutReceipt } = orderData as typeof orderData & { receipt_url: string | null };
      const retry = await supabase
        .from("orders")
        .insert([orderDataWithoutReceipt])
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("[POST /api/orders] Error insertando en Supabase:", error);
      throw error;
    }

    return NextResponse.json({ id: data.id, status: "success" });
  } catch (error: any) {
    console.error("[POST /api/orders] Error procesando la orden:", error);
    return NextResponse.json(
      { error: "Ha ocurrido un error al procesar la orden.", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
