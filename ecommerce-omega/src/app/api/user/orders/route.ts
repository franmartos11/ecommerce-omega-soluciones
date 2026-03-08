/* eslint-disable */
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "No email provided." }, { status: 400 });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .ilike("user_email", email) // Flexible case insensitive match
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/user/orders] Ext Supabase Error:", error);
      throw error;
    }

    return NextResponse.json(orders || [], { status: 200 });
  } catch (error: any) {
    console.error("[GET /api/user/orders] Exception:", error);
    return NextResponse.json(
      { error: "Error al obtener historial de compras." },
      { status: 500 }
    );
  }
}
