"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FirebaseError } from "firebase/app";

// Firebase (ajustá paths si no usás alias "@/")
import { signInEmail } from "../lib/firebase/auth-clients";
import { auth } from "../lib/firebase/firebase";
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

type FormErrors = { email?: string; password?: string; api?: string };

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = useCallback(
    (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    []
  );

  // Reglas fuertes; si querés mínimo 6, usá: /.{6,}/
  const validatePassword = useCallback(
    (value: string): boolean =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value),
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!validateEmail(email)) newErrors.email = "El correo no es válido";
    if (!validatePassword(password)) {
      newErrors.password =
        "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, validateEmail, validatePassword]);

  useEffect(() => {
    if (submitted) validateForm();
  }, [submitted, email, password, validateForm]);

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

      // Persistencia según “Recordarme”
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );

      // Login Firebase
      await signInEmail({ email, password });

      // (Opcional) Flag local propio
      localStorage.setItem("userLoggedIn", JSON.stringify({ email, remember }));

      router.push("/");
    } catch (err: unknown) {
      const code = err instanceof FirebaseError ? err.code : undefined;
      let msg = "Error al iniciar sesión";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        msg = "Credenciales incorrectas";
      } else if (code === "auth/user-not-found") {
        msg = "No existe un usuario con ese email";
      } else if (code === "auth/too-many-requests") {
        msg = "Demasiados intentos. Probá más tarde.";
      }
      setErrors(prev => ({ ...prev, api: msg }));
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4"
      style={{ background:"var(--color-primary-bg)"}}
    >
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-10">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-4" />
      </div>

      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md shadow-md rounded-xl p-8 lg:mr-20"
        style={{ background:"var(--bgweb)"}}
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <input
            type="email"
            placeholder="example@omega.com"
            className={`w-full text-black border ${
              submitted && errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
              submitted && errors.email ? "ring-red-400" : "ring-text1"
            }`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
          />
          {submitted && errors.email && (
            <p className="text-xs text-red-500 -mt-4">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="••••••••"
            className={`w-full text-black border ${
              submitted && errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md py-2 px-3 text-sm outline-none focus:ring-2 ${
              submitted && errors.password ? "ring-red-400" : "ring-text1"
            }`}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {submitted && errors.password && (
            <p className="text-xs text-red-500 -mt-4">{errors.password}</p>
          )}

          {errors.api && <p className="text-sm text-red-500">{errors.api}</p>}

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 select-none" style={{ color:"var(--color-secondary-text)"}}>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(prev => !prev)}
                className="accent-text1"
              />
              Recordarme
            </label>
            <Link href="/CambioContrasena" className="hover:underline" style={{ color:"var(--color-secondary-text)"}}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full  py-2 rounded-md transition disabled:opacity-50 cursor-pointer"
            style={{ color:"var(--color-tertiary-text)", background:"var(--color-primary-bg)"}}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm" style={{ color:"var(--color-primary-text)"}}>
          ¿No tenés cuenta?{" "}
          <Link href="/Registro" className="hover:underline font-medium" style={{ color:"var(--color-primary-bg)"}}>
            Registrate
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
