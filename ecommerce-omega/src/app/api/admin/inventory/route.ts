/* eslint-disable */
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filterLow = searchParams.get('low') === 'true';

    // Base query
    let query = supabase
      .from("products")
      .select("id, title, sku, stock, image_url, mfg, active")
      .order("stock", { ascending: true }); // Always sort by lowest stock first

    // Limit to items with stock <= 5 if the 'low' filter is ON
    if (filterLow) {
      query = query.lte("stock", 5);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Map snake_case database columns to camelCase for the UI
    const mappedData = data.map((item: any) => ({
      ...item,
      imageUrl: item.image_url,
      image_url: undefined // cleanup
    }));

    return NextResponse.json(mappedData, { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/admin/inventory] Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Error al obtener el inventario." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Formato inválido. Se esperaba un array de { id, stock }." },
        { status: 400 }
      );
    }

    // Update items sequentially (for a bulk dashboard, usually < 10 changes at once)
    const promises = items.map(item => 
      supabase
        .from("products")
        .update({ stock: item.stock })
        .eq("id", item.id)
    );

    await Promise.all(promises);

    return NextResponse.json({ success: true, message: "Stock actualizado masivamente." });
  } catch (error: any) {
    console.error("[PATCH /api/admin/inventory] Error bulk updating stock:", error);
    return NextResponse.json(
      { error: "Error al actualizar el stock." },
      { status: 500 }
    );
  }
}
