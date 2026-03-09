import { NextResponse } from "next/server";
import { getSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

// GET all settings (Admin Context)
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("key", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/settings] Error:", error);
    return NextResponse.json({ error: "No se pudieron obtener los ajustes." }, { status: 500 });
  }
}

// PUT (Update) a setting
export async function PUT(req: Request) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Configuration Key (key) is required." }, { status: 400 });
    }

    // Using upsert since we use an ON CONFLICT (key) rule
    const { error } = await supabase
      .from("site_settings")
      .upsert({
        key: key,
        value: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) throw error;

    return NextResponse.json({ success: true, key }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/admin/settings] Error updating setting:", error);
    return NextResponse.json({ error: "Error al actualizar el ajuste." }, { status: 500 });
  }
}
