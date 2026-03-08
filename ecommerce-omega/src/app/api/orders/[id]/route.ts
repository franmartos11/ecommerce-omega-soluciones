/* eslint-disable */
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Falta el ID de la orden." }, { status: 400 });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !order) {
      console.error("[GET /api/orders/[id]] Error fetching order:", error);
      return NextResponse.json({ error: "Orden no encontrada." }, { status: 404 });
    }

    // Mapeo adaptativo para el frontend
    const formattedOrder = {
      id: order.id,
      items: order.items,
      shipping: order.shipping,
      paymentMethod: order.payment_method,
      total: order.total,
      status: order.status,
      reference: order.reference,
      createdAt: order.created_at,
    };

    return NextResponse.json(formattedOrder, { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/orders/[id]] Exception:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
