import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Note: in NextJS 15 params may be a Promise
    const { id } = await params;

    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json({ error: "No product ID provided." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("id", id)
      .eq("active", true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
         return NextResponse.json({ error: "Product not found." }, { status: 404 });
      }
      throw error;
    }
    
    // Map data for the UI
    const productDetail = {
      id: data.id,
      title: data.title,
      description: data.description,
      
      currentPrice: Number(data.price),
      oldPrice: data.old_price !== null ? Number(data.old_price) : Number(data.price), 
      
      stock: Number(data.stock),
      imageUrl: data.image_url,
      galleryUrls: data.gallery_urls || [],
      category: data.category,
      active: data.active,

      sku: data.sku || "N/A",
      tags: data.tags || [data.category || "General"],
      mfg: data.mfg || "N/A",
      life: data.life || "N/A",
      rating: data.rating !== null ? Number(data.rating) : 5.0,

      // UI Fallbacks
      brand: "Omega", 
      color: data.color || "N/A",
      badgeText: data.badge_text || null,
      badgeColor: data.badge_color || null,
      condition: "New",
      variants: data.product_variants || [],
      
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    return NextResponse.json(productDetail, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/products/[id]] Error:`, error);
    return NextResponse.json(
      { error: "Error al obtener el detalle del producto." },
      { status: 500 }
    );
  }
}
