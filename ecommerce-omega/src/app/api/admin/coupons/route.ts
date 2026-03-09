/* eslint-disable */
import { NextResponse } from "next/server";
import { getSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/admin/coupons] Error fetching coupons:", error);
    return NextResponse.json(
      { error: error.message || "Error al obtener los cupones." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { code, discount_type, discount_value, max_uses, expires_at } = body;

    if (!code || !discount_type || !discount_value) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios (code, discount_type, discount_value)." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("coupons")
      .insert([
        { 
          code: code.toUpperCase(), 
          discount_type, 
          discount_value: Number(discount_value), 
          max_uses: max_uses ? Number(max_uses) : null,
          expires_at: expires_at || null,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation in Postgres
        return NextResponse.json({ error: "El código de cupón ya existe." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/coupons] Error creating coupon:", error);
    return NextResponse.json(
      { error: "Error al crear el cupón." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de cupón faltante." }, { status: 400 });
    }

    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/coupons] Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Error al eliminar el cupón." },
      { status: 500 }
    );
  }
}

