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
      return NextResponse.json({ error: "No product ID provided." }, { status: 400 });
    }

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", id)
      .eq("status", "approved") // Only returning approved reviews
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/products/[id]/reviews] Ext Supabase Error:", error);
      throw error;
    }

    // Calcula promedio si hay reseñas para enviarlo de forma eficiente al Frontend
    let averageRating = 0;
    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = Number((sum / reviews.length).toFixed(1));
    }

    return NextResponse.json({ reviews, averageRating }, { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/products/[id]/reviews] Exception:", error);
    return NextResponse.json(
      { error: "Error al obtener reseñas del producto." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const { userName, rating, comment } = body;

    // Validación básica de entrada
    if (!id || !userName || !rating) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (product_id, nombre, calificación)." },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La calificación debe estar entre 1 y 5 estrellas." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          product_id: id,
          user_name: userName,
          rating: Number(rating),
          comment: comment || null,
          status: "approved" // Por defecto en approved basado en Implementation Plan
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, review: data }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/products/[id]/reviews] Error:", error);
    return NextResponse.json(
      { error: "Error al procesar la inserción de la reseña." },
      { status: 500 }
    );
  }
}
