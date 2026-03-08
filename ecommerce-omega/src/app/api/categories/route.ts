/* eslint-disable */
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) throw error;
    
    // Convert to the exact Category format the UI (ProductListSection) expects
    const categories = data.map((doc: any) => ({
      id: doc.id,
      nombre: doc.nombre,
      slug: doc.slug,
      icon_url: doc.icon_url || null,
    }));

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("[GET /api/categories] Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error al obtener las categorías." },
      { status: 500 }
    );
  }
}
