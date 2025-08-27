"use client";

import { useState } from "react";
import { sendResetEmail } from "../lib/firebase/auth-clients";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Ingresá un correo válido");
      return;
    }

    try {
      setLoading(true);
      // Redirigir a tu página que define la nueva contraseña:
      const continueUrl = `${window.location.origin}/reset-password`;
      await sendResetEmail(email, continueUrl);
      setSent(true);
    } catch (error: any) {
      const code = error?.code as string | undefined;
      if (code === "auth/user-not-found") {
        // Por seguridad, podés no revelar si existe o no
        setSent(true);
      } else {
        setErr("No se pudo enviar el email. Intenta más tarde.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-2">
          <h1 className="text-xl font-semibold">Revisa tu correo</h1>
          <p className="text-sm text-black">
            Si el correo existe, recibirás un mensaje con instrucciones para restablecer tu contraseña.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg2 px-4">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold text-gray-800">Recuperar contraseña</h1>
        <input
          type="email"
          placeholder="tu@correo.com"
          className="w-full text-black border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 ring-green-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-black py-2 rounded-md transition ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Enviando…" : "Enviar enlace"}
        </button>
      </form>
    </div>
  );
}
