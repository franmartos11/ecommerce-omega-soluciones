import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { orderId, status } = body;

  if (!orderId || !status) {
    return NextResponse.json(
      { error: "Faltan datos de la orden" },
      { status: 400 }
    );
  }

  console.log(`✅ Confirmando pago de la orden ${orderId} con estado ${status}`);

  // Aquí normalmente actualizarías tu base de datos.
  // Por ejemplo:
  // await db.orders.update({
  //   where: { id: orderId },
  //   data: { paymentStatus: status },
  // });

  // Simulamos confirmación exitosa
  return NextResponse.json({ success: true });
}
