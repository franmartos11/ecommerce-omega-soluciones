// ./src/app/api/auth/recovery/start/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateNumericCode, hashCode } from '@/lib/crypto';
import { sendRecoveryCodeEmail } from '@/lib/email';
import { enforceRate } from '@/lib/ratelimit';

const WINDOW_MINUTES = 15;

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      (req as any)?.ip ??
      'ip:unknown';

    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Email inválido' }, { status: 400 });
    }

    // Rate limit por IP+email (5 req/5min sugerido en lib/ratelimit)
    const rl = await enforceRate(ip, `recovery:start:${email}`);
    if (!rl.ok) {
      return NextResponse.json(
        { message: 'Demasiados intentos. Probá más tarde.' },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // 🔒 Política de enumeración de usuarios:
    // - Si NO querés revelar si existe el email, devolvé 200 siempre (descomentá la línea siguiente).
    // return NextResponse.json({ ok: true });
    // - Si tu requerimiento es avisar que no existe (como mencionaste), dejamos 404:
    if (!user) {
      return NextResponse.json({ message: 'El email no está registrado' }, { status: 404 });
    }

    // Invalida solicitudes previas no usadas
    await prisma.passwordResetRequest.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    // Genera y guarda código
    const code = generateNumericCode(6);
    const codeHash = await hashCode(code);
    const expiresAt = new Date(Date.now() + WINDOW_MINUTES * 60 * 1000);

    await prisma.passwordResetRequest.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt,
      },
    });

    // Envía email (Resend/SendGrid/SES según implementación en lib/email)
    await sendRecoveryCodeEmail(user.email, code);

    return NextResponse.json({ ok: true });
  } catch (err) {
    // ✅ Usamos la variable para que no marque @typescript-eslint/no-unused-vars
    console.error('Error en /api/auth/recovery/start', err);
    return NextResponse.json(
      { message: 'Error al iniciar la recuperación' },
      { status: 500 }
    );
  }
}
