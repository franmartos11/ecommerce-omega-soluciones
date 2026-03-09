import { NextResponse } from "next/server";
import { getSupabase } from "@/app/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Código no proporcionado." }, { status: 400 });
    }

    const uppercaseCode = code.trim().toUpperCase();

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", uppercaseCode)
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Cupón inválido o inexistente." }, { status: 404 });
    }

    // Comprobar límite de usos
    if (coupon.max_uses !== null && coupon.times_used >= coupon.max_uses) {
      return NextResponse.json({ error: "El cupón ha superado su límite de uso." }, { status: 400 });
    }

    // Comprobar vencimiento
    if (coupon.expires_at) {
      const expirationDate = new Date(coupon.expires_at);
      const now = new Date();
      if (now > expirationDate) {
        return NextResponse.json({ error: "El cupón ha expirado." }, { status: 400 });
      }
    }

    // Es válido
    return NextResponse.json({ 
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value
    }, { status: 200 });
    
  } catch (error) {
    console.error("[POST /api/checkout/validate-coupon] Error:", error);
    return NextResponse.json(
      { error: "Error interno al validar el cupón." },
      { status: 500 }
    );
  }
}
