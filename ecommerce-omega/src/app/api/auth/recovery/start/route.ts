import { NextResponse } from 'next/server';

// ⚠️ DEMO: almacenamiento en memoria (se reinicia al redeploy).
// En producción: usar DB (tabla password_resets) con campos email, code, expiresAt, attempts, etc.
const store = globalThis as unknown as {
  _recoveryStore?: Map<string, { code: string; expiresAt: number }>;
};
if (!store._recoveryStore) store._recoveryStore = new Map();
const recoveryStore = store._recoveryStore;

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// DEMO: “DB” de usuarios
const mockUsers = new Set<string>(['user@demo.com', 'aspa@example.com']);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (typeof email !== 'string') {
      return NextResponse.json({ message: 'Email inválido' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const exists = mockUsers.has(normalized);

    // Requisito del usuario: avisar si no está registrado
    if (!exists) {
      return NextResponse.json({ message: 'El email no está registrado' }, { status: 404 });
    }

    const code = generateCode();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos

    recoveryStore.set(normalized, { code, expiresAt });

    // TODO: Enviar email real (Resend, Sendgrid, SES, etc.)
    // Por ejemplo con Resend:
    // await resend.emails.send({
    //   from: 'Soporte <soporte@tu-dominio.com>',
    //   to: normalized,
    //   subject: 'Tu código de recuperación',
    //   text: `Tu código es: ${code}. Vence en 15 minutos.`,
    // });

    // Para debug local (¡no hacerlo en prod!)
    console.log(`[DEBUG] Código para ${normalized}: ${code}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error al iniciar la recuperación' },
      { status: 500 }
    );
  }
}
