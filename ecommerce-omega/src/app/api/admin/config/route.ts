import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase/server";
import defaultConfig from "@/ConfigJson/config.json";

export const dynamic = 'force-dynamic';

/**
 * GET - Reads the config from Supabase site_config table.
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'main')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error("[GET /api/admin/config] Supabase error:", error);
    }
    
    // Fallback if no rows exist yet or if empty object
    let json = data?.value;
    if (!json || Object.keys(json).length === 0) {
      json = defaultConfig;
    }

    return NextResponse.json(json, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/config] Error reading config from DB:", error);
    return NextResponse.json(
      { error: "Failed to read configuration file." },
      { status: 500 }
    );
  }
}

/**
 * PUT - Receives a full JSON payload and overwrites it in Supabase site_config.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid payload: must be a JSON object" },
        { status: 400 }
      );
    }

    body.actualizadoEn = new Date().toISOString();

    const supabase = getSupabaseAdmin();
    // Use upsert to create or update the single row
    const { error } = await supabase
      .from('site_config')
      .upsert({ key: 'main', value: body }, { onConflict: 'key' });

    if (error) {
      console.error("[PUT /api/admin/config] Supabase upsert error:", error);
      throw error;
    }

    return NextResponse.json(body, {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" }
    });
  } catch (error) {
    console.error("[PUT /api/admin/config] Error writing config to DB:", error);
    return NextResponse.json(
      { error: "Failed to save the configuration." },
      { status: 500 }
    );
  }
}

export const POST = PUT;
