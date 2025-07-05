"use client";

import { useRouter } from "next/navigation";

export default function PaymentFailure() {
  const router = useRouter();

  return (
    <div className="text-center mt-8">
      <h1 className="text-2xl font-bold text-red-600">El pago no pudo completarse</h1>
      <p className="mt-4">
        Tu pago fue rechazado o cancelado. Puedes intentar nuevamente.
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
