"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signInEmail, signInWithGoogle } from "../lib/supabase/auth-clients";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";

type FormErrors = { email?: string; password?: string; api?: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);

export default function LoginForm() {
  const router = useRouter();
  const cfg = useConfig();

  const logoObj = isRecord(cfg.Logo) ? cfg.Logo : undefined;
  const logoSrc = str(logoObj?.src, "/logo.png");
  const logoAlt = str(logoObj?.alt, cfg.sitio?.nombre ?? "Logo");
  const siteName = str(cfg.sitio?.nombre, "Omega Soluciones");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Supabase redirige automáticamente al callback — no hay más código acá
    } catch {
      setGoogleError("No se pudo iniciar sesión con Google. Intentá nuevamente.");
      setGoogleLoading(false);
    }
  };
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = useCallback(
    (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), []
  );
  const validatePassword = useCallback(
    (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value), []
  );

  const validateForm = useCallback((): boolean => {
    const e: FormErrors = {};
    if (!validateEmail(email)) e.email = "El correo no es válido";
    if (!validatePassword(password))
      e.password = "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [email, password, validateEmail, validatePassword]);

  useEffect(() => { if (submitted) validateForm(); }, [submitted, email, password, validateForm]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setErrors(prev => ({ ...prev, api: undefined }));
    if (!validateForm()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    try {
      setSubmitting(true);
      await signInEmail({ email, password });
      localStorage.setItem("userLoggedIn", JSON.stringify({ email, remember }));
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      const display = msg.includes("Invalid login credentials")
        ? "Credenciales incorrectas"
        : msg.includes("Email not confirmed")
        ? "Por favor confirmá tu correo electrónico primero."
        : msg.toLowerCase().includes('rate limit')
        ? "Servidor saturado (límite de correos). Intentá más tarde."
        : "Error al iniciar sesión";
      setErrors(prev => ({ ...prev, api: display }));
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full border rounded-md py-2.5 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-opacity-30";
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    borderColor: hasError ? "var(--color-danger, #ef4444)" : "var(--border, #e5e7eb)",
    color: "var(--color-primary-text)",
    background: "var(--bgweb)",
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "var(--bgweb)" }}
    >
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        {/* Card */}
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
              Iniciá sesión
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-secondary-text)" }}>
              Bienvenido de nuevo a {siteName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-secondary-text)" }}>
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-secondary-text)" }} />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className={inputBase}
                  style={inputStyle(!!submitted && !!errors.email)}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              {submitted && errors.email && (
                <p className="text-xs mt-1" style={{ color: "var(--color-danger, #ef4444)" }}>{errors.email}</p>
              )}
            </div>

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
                  style={inputStyle(!!submitted && !!errors.password)}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-secondary-text)" }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {submitted && errors.password && (
                <p className="text-xs mt-1" style={{ color: "var(--color-danger, #ef4444)" }}>{errors.password}</p>
              )}
            </div>

            {/* Error de API */}
            {errors.api && (
              <p className="text-sm" style={{ color: "var(--color-danger, #ef4444)" }}>{errors.api}</p>
            )}

            {/* Recordarme + olvidé contraseña */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 select-none cursor-pointer" style={{ color: "var(--color-secondary-text)" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(p => !p)}
                  className="rounded"
                  style={{ accentColor: "var(--color-primary-bg)" }}
                />
                Recordarme
              </label>
              <Link
                href="/CambioContrasena"
                className="hover:underline text-sm"
                style={{ color: "var(--color-primary-bg)" }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer w-full py-2.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-60"
              style={{
                background: "var(--color-primary-bg)",
                color: "var(--color-tertiary-text)",
              }}
              onMouseEnter={e => !submitting && ((e.currentTarget as HTMLElement).style.background = "var(--color-secondary-bg)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--color-primary-bg)")}
            >
              {submitting ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 border-t" style={{ borderColor: "var(--border, #e5e7eb)" }} />
            <span className="text-xs" style={{ color: "var(--color-secondary-text)" }}>o continuá con</span>
            <div className="flex-1 border-t" style={{ borderColor: "var(--border, #e5e7eb)" }} />
          </div>

          {/* Google */}
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

          {/* Link al registro */}
          <p className="text-sm text-center mt-2" style={{ color: "var(--color-secondary-text)" }}>
            ¿No tenés cuenta?{" "}
            <Link href="/Registro" className="font-medium hover:underline" style={{ color: "var(--color-primary-bg)" }}>
              Registrate gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
