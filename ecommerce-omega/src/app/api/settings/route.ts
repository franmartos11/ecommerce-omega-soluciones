import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error) throw error;
    
    // Map array to object: { "hero_banners": [...] }
    const settings = data.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("[GET /api/settings] Error fetching settings:", error);
    return NextResponse.json(
      { error: "Error al obtener la configuración global." },
      { status: 500 }
    );
  }
}
