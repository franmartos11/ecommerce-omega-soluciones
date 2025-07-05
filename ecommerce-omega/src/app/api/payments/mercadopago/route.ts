import { NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    // 🚀 Logs en cada request
    console.log("Access Token que está usando:", process.env.MP_ACCESS_TOKEN);
    console.log("Base URL que está usando:", process.env.NEXT_PUBLIC_BASE_URL);

    const body = await req.json();
    const { orderId, cartItems } = body;

    if (!orderId || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Faltan datos de la orden o el carrito" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(baseUrl)
    if (!baseUrl) {
      console.error("ERROR: NEXT_PUBLIC_BASE_URL no está definida!");
      return NextResponse.json(
        { error: "La variable NEXT_PUBLIC_BASE_URL no está definida en el entorno" },
        { status: 500 }
      );
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: cartItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          currency_id: "ARS",
          unit_price: item.price,
        })),
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
  } catch (error: any) {
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
}
