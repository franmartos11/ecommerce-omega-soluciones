// ./src/app/api/auth/recovery/start/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

// ⚠️ DEMO: almacenamiento en memoria (se borra en cada reinicio)
// En producción usar DB
const store = globalThis as unknown as {
  _recoveryStore?: Map<string, { code: string; expiresAt: number }>;
};
if (!store._recoveryStore) store._recoveryStore = new Map();
const recoveryStore = store._recoveryStore;

// Lista de usuarios mock
const mockUsers = new Set<string>(['demo@example.com', 'aspa@example.com']);

// Función para generar código numérico
function generateCode(len = 6) {
  return String(Math.floor(10 ** (len - 1) + Math.random() * 9 * 10 ** (len - 1)));
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ message: 'Email inválido' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();

    // Chequeo si existe (mock)
    if (!mockUsers.has(normalized)) {
      return NextResponse.json({ message: 'El email no está registrado' }, { status: 404 });
    }

    // Generar código y guardarlo en memoria
    const code = generateCode();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos
    recoveryStore.set(normalized, { code, expiresAt });

    // TODO: Enviar email real (ahora solo loguea en consola)
    console.log(`[DEBUG] Código para ${normalized}: ${code}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error en /api/auth/recovery/start', err);
    return NextResponse.json(
      { message: 'Error al iniciar la recuperación' },
      { status: 500 }
    );
  }
}
