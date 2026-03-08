import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

export async function POST(req: Request) {
  try {
    console.log("Access Token que está usando:", process.env.MP_ACCESS_TOKEN);
    console.log("Base URL que está usando:", process.env.NEXT_PUBLIC_BASE_URL);

    const body = await req.json();
    const { orderId, cartItems, coupon, shippingCost }: { orderId: string; cartItems: CartItem[]; coupon?: { code: string; amount: number }; shippingCost?: number } = body;

    if (!orderId || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Faltan datos de la orden o el carrito" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(baseUrl);
    if (!baseUrl) {
      console.error("ERROR: NEXT_PUBLIC_BASE_URL no está definida!");
      return NextResponse.json(
        { error: "La variable NEXT_PUBLIC_BASE_URL no está definida en el entorno" },
        { status: 500 }
      );
    }

    const preference = new Preference(client);

    const preferenceItems = cartItems.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      currency_id: "ARS",
      unit_price: item.price,
    }));

    if (coupon && coupon.amount > 0) {
      preferenceItems.push({
        id: "discount",
        title: `Descuento Cupón (${coupon.code})`,
        quantity: 1,
        currency_id: "ARS",
        unit_price: -Number(coupon.amount),
      });
    }

    if (shippingCost && shippingCost > 0) {
      preferenceItems.push({
        id: "shipping",
        title: "Costo de Envío",
        quantity: 1,
        currency_id: "ARS",
        unit_price: Number(shippingCost),
      });
    }

    const result = await preference.create({
      body: {
        items: preferenceItems,
        external_reference: orderId,
        back_urls: {
          success: `${baseUrl}/payment-success?orderId=${orderId}`,
          failure: `${baseUrl}/payment-failure?orderId=${orderId}`,
          pending: `${baseUrl}/payment-pending?orderId=${orderId}`,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({
      init_point: result.init_point,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creando preferencia Mercado Pago:", {
        message: error.message,
        stack: error.stack,
        error,
      });
      return NextResponse.json(
        { error: "No se pudo crear la preferencia", details: error.message },
        { status: 500 }
      );
    }
    console.error("Error desconocido:", error);
    return NextResponse.json(
      { error: "No se pudo crear la preferencia", details: "Unknown error" },
      { status: 500 }
    );
  }
}
