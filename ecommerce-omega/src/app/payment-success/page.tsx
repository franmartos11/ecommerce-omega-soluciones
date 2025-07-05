"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const collectionStatus = searchParams.get("collection_status");

    if (!orderId) {
      setStatus("error");
      return;
    }

    // Confirmar la orden con tu backend
    fetch("/api/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        status: collectionStatus === "approved" ? "paid" : "pending",
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          // Limpiar carrito del localStorage
          localStorage.removeItem("cart");
          setStatus("success");
        } else {
          console.error("Error confirmando pago:", await res.text());
          setStatus("error");
        }
      })
      .catch((err) => {
        console.error("Error confirmando pago:", err);
        setStatus("error");
      });
  }, [searchParams]);

  if (status === "loading") {
    return <p className="text-center mt-8">Confirmando tu pago...</p>;
  }

  if (status === "error") {
    return (
      <div className="text-center mt-8 text-red-600">
        <p>Ocurrió un error al confirmar tu compra.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 underline text-sm"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="text-center mt-8">
      <h1 className="text-2xl font-bold text-green-600">¡Gracias por tu compra!</h1>
      <p className="mt-4">Tu pago fue confirmado correctamente.</p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-bg1 hover:bg-bg2 text-white font-medium px-4 py-2 rounded-md"
      >
        Volver al inicio
      </button>
    </div>
  );
}
