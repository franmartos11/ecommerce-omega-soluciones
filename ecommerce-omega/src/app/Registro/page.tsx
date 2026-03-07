'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signUpEmail, signInWithGoogle } from '../lib/supabase/auth-clients';
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);

export default function RegisterForm() {
  const router = useRouter();
  const cfg = useConfig();

  const logoObj = isRecord(cfg.Logo) ? cfg.Logo : undefined;
  const logoSrc = str(logoObj?.src, "/logo.png");
  const logoAlt = str(logoObj?.alt, cfg.sitio?.nombre ?? "Logo");
  const siteName = str(cfg.sitio?.nombre, "Omega Soluciones");

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setGoogleError("No se pudo iniciar sesión con Google. Intentá nuevamente.");
      setGoogleLoading(false);
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    if (!validateEmail(form.email)) e.email = 'Correo inválido';
    if (!validatePassword(form.password))
      e.password = 'Debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Las contraseñas no coinciden';
    if (!form.termsAccepted) e.termsAccepted = 'Debés aceptar los términos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => { if (submitted) validateForm(); }, [form, submitted]);

  const handleChange = (field: keyof typeof form, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) return;
    setLoading(true);
    try {
      await signUpEmail({ email: form.email, password: form.password, displayName: form.name });
      router.push('/');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes('already registered')) setErrors({ api: 'Ese email ya está registrado.' });
      else if (msg.includes('invalid email')) setErrors({ api: 'Email inválido.' });
      else if (msg.includes('weak password') || msg.includes('Password should be'))
        setErrors({ api: 'Contraseña demasiado débil.' });
      else if (msg.toLowerCase().includes('rate limit'))
        setErrors({ api: 'Se ha excedido el límite de envíos de correo del servidor. Por favor, intentá más tarde.' });
      else setErrors({ api: 'Ocurrió un error en el registro.' });
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full border rounded-md py-2.5 pl-10 text-sm outline-none transition focus:ring-2 focus:ring-opacity-30";
  const getInputStyle = (field: string): React.CSSProperties => ({
    borderColor: submitted && errors[field] ? "var(--color-danger, #ef4444)" : "var(--border, #e5e7eb)",
    color: "var(--color-primary-text)",
    background: "var(--bgweb)",
    paddingRight: field === "password" || field === "confirmPassword" ? "2.5rem" : undefined,
  });

  const fields = [
    { label: "Nombre completo", name: "name", type: "text", placeholder: "Tu nombre", Icon: User },
    { label: "Correo electrónico", name: "email", type: "email", placeholder: "tu@email.com", Icon: Mail },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "var(--bgweb)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-xl border shadow-sm p-8"
          style={{
            background: "var(--surface, #ffffff)",
            borderColor: "var(--border, #e5e7eb)",
          }}
        >
          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={72}
              height={72}
              className="object-contain mb-4"
              style={{ width: "auto", maxHeight: "56px" }}
            />
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary-text)" }}>
              Crear cuenta
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-secondary-text)" }}>
              Unite a {siteName} y empezá a comprar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre y Email */}
            {fields.map(({ label, name, type, placeholder, Icon }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-secondary-text)" }}>
                  {label}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-secondary-text)" }} />
                  <input
                    type={type}
                    placeholder={placeholder}
                    className={inputBase}
                    style={getInputStyle(name)}
                    value={(form as unknown as Record<string, string>)[name]}
                    onChange={e => handleChange(name as keyof typeof form, e.target.value)}
                  />
                </div>
                {submitted && errors[name] && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-danger, #ef4444)" }}>{errors[name]}</p>
                )}
              </div>
            ))}

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-secondary-text)" }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-secondary-text)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputBase} pr-10`}
                  style={getInputStyle("password")}
                  value={form.password}
                  onChange={e => handleChange("password", e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-secondary-text)" }} tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {submitted && errors.password && (
                <p className="text-xs mt-1" style={{ color: "var(--color-danger, #ef4444)" }}>{errors.password}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-secondary-text)" }}>
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-secondary-text)" }} />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputBase} pr-10`}
                  style={getInputStyle("confirmPassword")}
                  value={form.confirmPassword}
                  onChange={e => handleChange("confirmPassword", e.target.value)}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-secondary-text)" }} tabIndex={-1}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {submitted && errors.confirmPassword && (
                <p className="text-xs mt-1" style={{ color: "var(--color-danger, #ef4444)" }}>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Términos */}
            <div>
              <label className="flex items-start gap-2 text-sm cursor-pointer select-none" style={{ color: "var(--color-secondary-text)" }}>
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={e => handleChange('termsAccepted', e.target.checked)}
                  className="mt-0.5 rounded"
                  style={{ accentColor: "var(--color-primary-bg)" }}
                />
                <span>
                  Acepto los{' '}
                  <Link href="/terminos" className="hover:underline font-medium" style={{ color: "var(--color-primary-bg)" }}>
                    términos y condiciones
                  </Link>
                </span>
              </label>
              {submitted && errors.termsAccepted && (
                <p className="text-xs mt-1" style={{ color: "var(--color-danger, #ef4444)" }}>{errors.termsAccepted}</p>
              )}
            </div>

            {/* Error API */}
            {errors.api && (
              <p className="text-sm" style={{ color: "var(--color-danger, #ef4444)" }}>{errors.api}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-2.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-60"
              style={{
                background: "var(--color-primary-bg)",
                color: "var(--color-tertiary-text)",
              }}
              onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.background = "var(--color-secondary-bg)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--color-primary-bg)")}
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          {/* Separador Google */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t" style={{ borderColor: "var(--border, #e5e7eb)" }} />
            <span className="text-xs" style={{ color: "var(--color-secondary-text)" }}>o continuá con</span>
            <div className="flex-1 border-t" style={{ borderColor: "var(--border, #e5e7eb)" }} />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="cursor-pointer w-full flex items-center justify-center gap-3 py-2.5 rounded-md border text-sm font-medium transition-colors disabled:opacity-60"
            style={{
              borderColor: "var(--border, #e5e7eb)",
              color: "var(--color-primary-text)",
              background: "var(--bgweb)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface, #f9fafb)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--bgweb)")}
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? "Redirigiendo..." : "Continuar con Google"}
          </button>

          {googleError && (
            <p className="text-xs text-center" style={{ color: "var(--color-danger, #ef4444)" }}>{googleError}</p>
          )}

          <p className="text-sm text-center" style={{ color: "var(--color-secondary-text)" }}>
            ¿Ya tenés cuenta?{' '}
            <Link href="/LogIn" className="font-medium hover:underline" style={{ color: "var(--color-primary-bg)" }}>
              Iniciá sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
