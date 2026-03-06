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

    // Calcular el total a partir de los items para evitar manipulaciones
    const total = body.cartItems.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );

    // Preparar el documento de la orden
    const orderData = {
      items: body.cartItems,
      shipping: body.shippingData,
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
