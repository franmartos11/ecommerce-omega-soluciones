"use client";

import { useRouter } from "next/navigation";

export default function PaymentPending() {
  const router = useRouter();

  return (
    <div className="text-center mt-8">
      <h1 className="text-2xl font-bold text-yellow-500">Pago pendiente de confirmación</h1>
      <p className="mt-4">
        Tu pago está siendo procesado. Te avisaremos cuando se confirme.
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-bg1 hover:bg-bg2 text-white font-medium px-4 py-2 rounded-md"
      >
        Volver al inicio
      </button>
    </div>
  );
}
