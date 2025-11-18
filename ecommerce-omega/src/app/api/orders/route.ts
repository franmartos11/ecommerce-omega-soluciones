import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body || !body.cartItems || body.cartItems.length === 0) {
    return NextResponse.json(
      { error: "Carrito vacío o datos faltantes" },
      { status: 400 }
    );
  }

  // Aquí normalmente guardarías en tu DB.
  // Ejemplo:
  // const newOrder = await db.order.create({ data: { ... } });

  // Por ahora, devolvemos un ID simulado:
  return NextResponse.json({ id: "order_" + Date.now() });
}
