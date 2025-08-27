"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmReset, verifyResetCode } from "../lib/firebase/auth-clients";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const oobCode = params.get("oobCode") || ""; // 👈 Firebase usa 'oobCode'
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [emailForReset, setEmailForReset] = useState<string | null>(null);

  // (opcional) verificar oobCode y obtener email asociado
  useEffect(() => {
    let mounted = true;
    async function checkCode() {
      if (!oobCode) return;
      try {
        const email = await verifyResetCode(oobCode);
        if (mounted) setEmailForReset(email);
      } catch {
        if (mounted) setErr("El enlace es inválido o ha expirado.");
      }
    }
    checkCode();
    return () => {
      mounted = false;
    };
  }, [oobCode]);

  const validatePassword = (p: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(p);
  // Si querés sólo mínimo 6, usa:  /.{6,}/

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!validatePassword(password)) {
      setErr(
        "La contraseña debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo."
      );
      return;
    }
    if (!oobCode) {
      setErr("Token inválido");
      return;
    }
    setLoading(true);
    try {
      await confirmReset(oobCode, password);
      router.push("/login"); // o "/signin"
    } catch {
      setErr("No se pudo restablecer la contraseña. Probá otra vez.");
    } finally {
      setLoading(false);
    }
  };

  if (!oobCode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Token inválido
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold text-gray-800">Definir nueva contraseña</h1>

        {emailForReset && (
          <p className="text-sm text-gray-600">
            Restableciendo para <span className="font-medium">{emailForReset}</span>
          </p>
        )}

        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 ring-green-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <p className="text-sm text-red-500">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded-md transition ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Guardando…" : "Guardar contraseña"}
        </button>
      </form>
    </div>
  );
}
