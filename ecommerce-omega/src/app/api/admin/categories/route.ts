/* eslint-disable */
import { NextResponse } from "next/server";
import { createBrowserClient } from "@supabase/ssr";

export const dynamic = 'force-dynamic';

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(req: Request) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/categories] Error:", error);
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.nombre || !body.slug) {
      return NextResponse.json({ error: "Nombre and slug are required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("categories")
      .insert([{ nombre: body.nombre, slug: body.slug, icon_url: body.icon_url || null }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, category: data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/categories] Error:", error);
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nombre, slug, icon_url } = body;

    if (!id || !nombre || !slug) {
      return NextResponse.json({ error: "id, nombre, and slug are required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("categories")
      .update({ nombre, slug, icon_url: icon_url || null })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/categories] Error:", error);
    return NextResponse.json({ error: "Error updating category" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/categories] Error:", error);
    return NextResponse.json({ error: "Error deleting category" }, { status: 500 });
  }
}
