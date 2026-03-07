import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/client";

// Record representing dynamic provinces and their respective shipping price
export interface ShippingRates {
  [province: string]: number;
}

const SETTING_KEY = "shipping_rates";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .single();

    if (error && error.code !== "PGRST116") { // Ignore if not found
      throw error;
    }

    // Default object if it hasn't been set yet
    let rates: ShippingRates = data?.value || {
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
  } catch (error: any) {
    console.error("[GET /api/admin/shipping] Error:", error);
    return NextResponse.json(
      { error: "Error obteniendo las tarifas de envío" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Basic super admin validation if required in your app. Leaving open for now if handled by middleware.
    
    const newRates: ShippingRates = await req.json();

    // Check if the setting exists
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", SETTING_KEY)
      .single();

    let response;
    if (existing) {
      // Update
      response = await supabase
        .from("site_settings")
        .update({ value: newRates })
        .eq("key", SETTING_KEY);
    } else {
      // Insert
      response = await supabase
        .from("site_settings")
        .insert({ key: SETTING_KEY, value: newRates });
    }

    if (response.error) throw response.error;

    return NextResponse.json({ message: "Tarifas actualizadas correctamente." });
  } catch (error: any) {
    console.error("[POST /api/admin/shipping] Error:", error);
    return NextResponse.json(
      { error: "Error al actualizar las tarifas", details: error.message },
      { status: 500 }
    );
  }
}
