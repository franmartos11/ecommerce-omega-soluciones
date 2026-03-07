import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.cartItems || body.cartItems.length === 0) {
      return NextResponse.json(
        { error: "Carrito vacío o datos faltantes" },
        { status: 400 }
      );
    }

    // Calcular el subtotal a partir de los items para evitar manipulaciones
    let subtotal = body.cartItems.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );

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
    const total = Math.max(0, subtotal - discountAmount) + shippingCost;

    // Preparar el documento de la orden
    const orderData = {
      items: body.cartItems,
      shipping: { ...body.shippingData, cost: shippingCost },
      payment_method: body.paymentMethod || "unknown", // Nota: snake_case para db
      user_email: body.userEmail || null, // Guardamos el usuario logueado
      total: total,
      status: "pendiente",
      // created_at y updated_at los maneja postgres automáticamente via defaults
      reference: body.paymentData?.transferReference || null,
    };

    // Guardar en Supabase -> tabla "orders"
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error("[POST /api/orders] Error insertando en Supabase:", error);
      throw error;
    }

    return NextResponse.json({ id: data.id, status: "success" });
  } catch (error: any) {
    console.error("[POST /api/orders] Error procesando la orden:", error);
    return NextResponse.json(
      { error: "Ha ocurrido un error al procesar la orden." },
      { status: 500 }
    );
  }
}
