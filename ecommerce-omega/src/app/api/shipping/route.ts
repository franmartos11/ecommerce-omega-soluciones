import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export interface ShippingRates {
  [province: string]: number;
}

const SETTING_KEY = "shipping_rates";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .single();

    if (error && error.code !== "PGRST116") { // Ignore if not found
      throw error;
    }

    // Default object if it hasn't been set yet
    const rates: ShippingRates = data?.value || {
      CABA: 3000,
      "GBA Norte": 4000,
      "GBA Sur": 4500,
      "GBA Oeste": 4500,
      "Buenos Aires Interior": 6000,
      Córdoba: 8000,
      "Santa Fe": 8000,
      Mendoza: 9000,
    };

    return NextResponse.json(rates);
  } catch (error: unknown) {
    console.error("[GET /api/shipping] Error:", error);
    return NextResponse.json(
      { error: "Error obteniendo las tarifas de envío" },
      { status: 500 }
    );
  }
}
