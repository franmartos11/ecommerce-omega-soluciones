/* eslint-disable */
import { NextResponse } from "next/server";
import { getSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const relatedTo = searchParams.get('relatedTo');
    let data: any[] = [];

    // --- NUEVO: Lógica de Productos Relacionados Inteligente ---
    if (relatedTo) {
      // 1. Obtener la categoría del producto actual
      const { data: sourceProduct, error: sourceErr } = await supabase
        .from("products")
        .select("category")
        .eq("id", relatedTo)
        .single();
        
      if (sourceErr) console.warn("Related fetch source error:", sourceErr);
      const sourceCategory = sourceProduct?.category;

      let relatedProducts: any[] = [];

      // 2. Si tiene categoría, buscar hasta 4 de la misma rama
      if (sourceCategory) {
        const { data: catMatches } = await supabase
          .from("products")
          .select("*")
          .eq("active", true)
          .eq("category", sourceCategory)
          .neq("id", relatedTo)  // No mostrar el mismo producto
          .limit(4);
          
        if (catMatches) relatedProducts = catMatches;
      }

      // 3. Rellenar si faltan para llegar a 4 (fallback a los más nuevos)
      if (relatedProducts.length < 4) {
        const needed = 4 - relatedProducts.length;
        const excludedIds = [relatedTo, ...relatedProducts.map(p => p.id)];
        
        const { data: fallbackMatches } = await supabase
          .from("products")
          .select("*")
          .eq("active", true)
          .not("id", "in", `(${excludedIds.join(',')})`)
          .order("created_at", { ascending: false })
          .limit(needed);
          
        if (fallbackMatches) {
          relatedProducts = [...relatedProducts, ...fallbackMatches];
        }
      }

      data = relatedProducts;
    } else {
      // --- Lógica Normal Diaria ---
      const query = supabase
        .from("products")
        .select("*")
        .eq("active", true) // Only fetch active products for the public storefront
        .gt("stock", 0) // Only fetch products with stock > 0
        .order("created_at", { ascending: false });

      const res = await query;
      data = res.data || [];
      if (res.error) throw res.error;
    }
    
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
      { error: "Error al obtener los productos.", details: error instanceof Error ? error.message : String(error), env_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL, env_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
      { status: 500 }
    );
  }
}
