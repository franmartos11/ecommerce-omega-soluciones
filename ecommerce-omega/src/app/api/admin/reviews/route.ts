/* eslint-disable */
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

/**
 * GET - Obtiene TODAS las reseñas de la plataforma (Aprobadas o Rechazadas)
 * Útil para el panel de revisión del administrador.
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    // Usamos un .select() anidado para traer también datos del producto
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        products (
          id,
          title,
          image_url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/admin/reviews] Error fetching:", error);
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/admin/reviews] Exception:", error);
    return NextResponse.json(
      { error: "Error al obtener reseñas del sistema." },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Actualiza el estado de la reseña
 * Body esperado: { reviewId: "uuid", status: "pending" | "approved" | "rejected" }
 */
export async function PATCH(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const { reviewId, status } = await req.json();

    if (!reviewId || !status) {
      return NextResponse.json(
        { error: "Falta reviewId o status." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", reviewId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: "Estado de reseña actualizado." }, { status: 200 });
  } catch (error: any) {
    console.error("[PATCH /api/admin/reviews] Error updating review:", error);
    return NextResponse.json(
      { error: "Error interno modificando la reseña." },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Borra permanentemente una reseña
 * Body esperado: { reviewId: "uuid" }
 */
export async function DELETE(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json({ error: "No review ID to delete." }, { status: 400 });
    }

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("[DELETE /api/admin/reviews] Error:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar." },
      { status: 500 }
    );
  }
}
