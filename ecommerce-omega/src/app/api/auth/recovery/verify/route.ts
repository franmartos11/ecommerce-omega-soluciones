import { NextResponse } from 'next/server';

const store = globalThis as unknown as {
  _recoveryStore?: Map<string, { code: string; expiresAt: number }>;
};
const recoveryStore = store._recoveryStore ?? new Map();

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (typeof email !== 'string' || typeof code !== 'string') {
      return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const entry = recoveryStore.get(normalized);
    if (!entry) {
      return NextResponse.json(
        { message: 'No hay una solicitud de recuperación vigente' },
        { status: 400 }
      );
    }

    if (Date.now() > entry.expiresAt) {
      recoveryStore.delete(normalized);
      return NextResponse.json({ message: 'El código expiró' }, { status: 400 });
    }

    if (code.trim() !== entry.code) {
      return NextResponse.json({ message: 'Código incorrecto' }, { status: 400 });
    }

    // OK: invalidar el código usado
    recoveryStore.delete(normalized);

    // Generar token de un solo uso (DEMO).
    // En producción: usar JWT firmado o registro en DB con TTL.
    const token = Buffer.from(`${normalized}:${Date.now()}`).toString('base64url');

    return NextResponse.json({ ok: true, token });
  } catch {
    return NextResponse.json(
      { message: 'Error al validar el código' },
      { status: 500 }
    );
  }
}
