import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const relatedTo = searchParams.get('relatedTo');

    let query = supabase
      .from("products")
      .select("*")
      .eq("active", true) // Only fetch active products for the public storefront
      .order("created_at", { ascending: false });

    // If relatedTo is provided, exclude that product from the list
    if (relatedTo) {
        query = query.neq("id", relatedTo).limit(4);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Map from snake_case to camelCase
    // We add placeholder default values for missing DB columns required by frontend UI
    const products = data.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      
      // Map DB 'price' to what the UI expects
      currentPrice: Number(doc.price),
      oldPrice: doc.old_price !== null ? Number(doc.old_price) : Number(doc.price),
      
      stock: Number(doc.stock),
      imageUrl: doc.image_url,
      galleryUrls: doc.gallery_urls || [],
      category: doc.category,
      active: doc.active,

      // Data from DB
      sku: doc.sku || "N/A",
      tags: doc.tags || [doc.category || "General"],
      mfg: doc.mfg || "N/A",
      life: doc.life || "N/A",
      rating: doc.rating !== null ? Number(doc.rating) : 5.0,

      // UI Fallbacks
      brand: "Omega", 
      color: doc.color || "N/A",
      badgeText: doc.badge_text || null,
      badgeColor: doc.badge_color || null,
      condition: "New",
      
      createdAt: doc.created_at,
      updatedAt: doc.updated_at
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("[GET /api/products] Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener los productos." },
      { status: 500 }
    );
  }
}
