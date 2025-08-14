'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Step = 'email' | 'code';
type Form = { email: string; code: string };
type Errors = Record<string, string>;
type Touched = Partial<Record<keyof Form, boolean>>;

export default function RecoverAccount() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [form, setForm] = useState<Form>({ email: '', code: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validateCode = (code: string) => /^[0-9]{6}$/.test(code.trim());

  const validateForm = (currentStep: Step, f: Form): Errors => {
    const e: Errors = {};
    if (currentStep === 'email') {
      if (!validateEmail(f.email)) e.email = 'Correo inválido';
    } else {
      if (!validateEmail(f.email)) e.email = 'Correo inválido';
      if (!validateCode(f.code)) e.code = 'El código debe tener 6 dígitos';
    }
    return e;
  };

  const handleChange = (field: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // 👇 No validamos acá para evitar “en vivo”
  };

  const handleBlur = (field: keyof Form) => {
    setTouched((t) => ({ ...t, [field]: true }));
    // Validamos SOLO al salir del campo
    const newErrors = validateForm(step, form);
    setErrors(newErrors);
  };

  const startRecovery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/recovery/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ api: data?.message || 'No se pudo iniciar la recuperación' });
        return;
      }
      setErrors({});
      setStep('code');
      setCooldown(60);
    } catch {
      setErrors({ api: 'No se pudo conectar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/recovery/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), code: form.code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ api: data?.message || 'Código inválido' });
        return;
      }
      router.push(`/reset-password?token=${encodeURIComponent(data.token)}`);
    } catch {
      setErrors({ api: 'No se pudo conectar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Validamos SOLO al enviar
    const newErrors = validateForm(step, form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (step === 'email') await startRecovery();
    else await verifyCode();
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    // Revisamos formato de email al reintentar
    const newErrors = validateForm('email', form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    await startRecovery();
  };

  const showError = (name: keyof Form) =>
    (submitted || touched[name]) && errors[name];

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-400 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Recuperar Cuenta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 w-5 h-5" />
              <input
                type="email"
                placeholder="Correo electrónico"
                className={`pl-10 text-gray-600 w-full border ${
                  showError('email') ? 'border-red-500' : 'border-gray-300'
                } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
                  showError('email') ? 'ring-red-400' : 'ring-green-400'
                }`}
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                autoComplete="email"
                inputMode="email"
              />
            </div>
            {showError('email') && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Paso 2: Código (solo si estamos en code) */}
          {step === 'code' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de verificación (6 dígitos)
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="••••••"
                className={`w-full border ${
                  showError('code') ? 'border-red-500' : 'border-gray-300'
                } rounded-md py-2 px-3 text-sm text-gray-600 outline-none focus:ring-2 ${
                  showError('code') ? 'ring-red-400' : 'ring-green-400'
                } tracking-widest text-center`}
                value={form.code}
                onChange={(e) => handleChange('code', e.target.value)}
                onBlur={() => handleBlur('code')}
              />
              {showError('code') && (
                <p className="text-xs text-red-500 mt-1">{errors.code}</p>
              )}

              {/* Reenviar */}
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className={`text-sm ${
                    cooldown > 0 || loading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-green-600 hover:underline'
                  }`}
                >
                  {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar código'}
                </button>
                <span className="text-xs text-gray-500">
                  Revisá tu correo (incluye spam)
                </span>
              </div>
            </div>
          )}

          <p className="text-sm text-center text-black py-2 rounded-md">
            {step === 'email'
              ? 'Ingrese su email para enviar un código de verificación si la cuenta existe.'
              : 'Ingrese el código que le enviamos al email para continuar con la recuperación.'}
          </p>

          {/* Error API */}
          {submitted && errors.api && (
            <p className="text-sm text-red-500">{errors.api}</p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={`w-full text-white py-2 rounded-md transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading
              ? 'Procesando…'
              : step === 'email'
              ? 'Enviar código'
              : 'Validar código'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-green-600 hover:underline font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
