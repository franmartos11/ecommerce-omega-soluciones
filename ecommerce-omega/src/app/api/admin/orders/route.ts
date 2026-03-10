import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

/**
 * GET - Devuelve el historial de todas las órdenes ordenadas por fecha reciente.
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Mapear snake_case a camelCase para no romper el frontend
    const orders = data.map(doc => ({
      id: doc.id,
      items: doc.items,
      shipping: doc.shipping,
      paymentMethod: doc.payment_method,
      total: doc.total,
      status: doc.status,
      reference: doc.reference,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at
    }));

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/orders] Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error al obtener las órdenes." },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Actualiza el estado de una orden.
 * Requiere: { orderId: string, status: "pendiente" | "pagado" | "enviado" }
 */
export async function PATCH(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios (orderId, status)." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("orders")
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", orderId);
    
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Estado de orden actualizado." });
  } catch (error) {
    console.error("[PATCH /api/admin/orders] Error updating order:", error);
    return NextResponse.json(
      { error: "Error al actualizar la orden." },
      { status: 500 }
    );
  }
}
