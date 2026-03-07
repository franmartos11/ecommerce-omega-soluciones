import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .order("id", { ascending: false });

    if (error) throw error;

    // Convert keys to camelCase for the frontend UI
    const products = data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      oldPrice: item.old_price,
      stock: item.stock,
      sku: item.sku,
      tags: item.tags,
      mfg: item.mfg,
      life: item.life,
      rating: item.rating,
      color: item.color,
      badgeText: item.badge_text,
      badgeColor: item.badge_color,
      imageUrl: item.image_url,
      galleryUrls: item.gallery_urls,
      category: item.category,
      active: item.active,
      variants: item.product_variants || [],
      createdAt: item.created_at,
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/products] Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener los productos." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newProduct = {
      title: body.title,
      description: body.description || null,
      price: body.price,
      old_price: body.oldPrice || null,
      stock: body.stock || 0,
      sku: body.sku || null,
      tags: body.tags || [],
      mfg: body.mfg || null,
      life: body.life || null,
      rating: body.rating || 5.0,
      color: body.color || null,
      badge_text: body.badgeText || null,
      badge_color: body.badgeColor || null,
      image_url: body.imageUrl || null,
      gallery_urls: body.galleryUrls || [],
      category: body.category || null,
      active: body.active !== undefined ? body.active : true,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select()
      .single();

    if (error) throw error;

    // Handle variants if any are provided
    if (body.variants && Array.isArray(body.variants) && body.variants.length > 0) {
      const variantsToInsert = body.variants.map((v: any) => ({
        product_id: data.id,
        name: v.name,
        sku: v.sku || null,
        price: v.price || null,
        stock: v.stock || 0,
      }));

      const { error: variantError } = await supabase
        .from("product_variants")
        .insert(variantsToInsert);

      if (variantError) throw variantError;
    }

    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/admin/products] Error creating product:", error);
    return NextResponse.json(
      { error: "Error al crear producto.", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const updates = {
      title: body.title,
      description: body.description,
      price: body.price,
      old_price: body.oldPrice,
      stock: body.stock,
      sku: body.sku,
      tags: body.tags,
      mfg: body.mfg,
      life: body.life,
      rating: body.rating,
      color: body.color,
      badge_text: body.badgeText,
      badge_color: body.badgeColor,
      image_url: body.imageUrl,
      gallery_urls: body.galleryUrls,
      category: body.category,
      active: body.active,
      updated_at: new Date().toISOString()
    };
    
    // Remover keys indefinidas para no sobreescribir con null accidente
    Object.keys(updates).forEach(key => {
      if ((updates as any)[key] === undefined) {
        delete (updates as any)[key];
      }
    });

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    // Handle variants sync if provided
    if (body.variants !== undefined) {
      if (!Array.isArray(body.variants) || body.variants.length === 0) {
        // If empty array, delete all variants
        await supabase.from("product_variants").delete().eq("product_id", id);
      } else {
        // Get existing variants
        const { data: existingVariants } = await supabase
          .from("product_variants")
          .select("id")
          .eq("product_id", id);

        const existingIds = existingVariants?.map((v) => v.id) || [];
        const incomingIds = body.variants.filter((v: any) => v.id).map((v: any) => v.id);

        // Delete variants that are no longer in the payload
        const idsToDelete = existingIds.filter((eid) => !incomingIds.includes(eid));
        if (idsToDelete.length > 0) {
          await supabase.from("product_variants").delete().in("id", idsToDelete);
        }

        // Upsert variants
        const variantsToUpsert = body.variants.map((v: any) => ({
          ...(v.id ? { id: v.id } : {}), // only include id if it exists
          product_id: id,
          name: v.name,
          sku: v.sku || null,
          price: v.price || null,
          stock: v.stock || 0,
        }));

        const { error: variantError } = await supabase
          .from("product_variants")
          .upsert(variantsToUpsert);

        if (variantError) throw variantError;
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/products] Error updating product:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
      
    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/products] Error deleting product:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto." },
      { status: 500 }
    );
  }
}
