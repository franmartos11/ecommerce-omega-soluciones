"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success">("loading");

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const collectionStatus = searchParams.get("collection_status");

    if (!orderId) {
      router.replace("/payment-failure");
      return;
    }

    if (collectionStatus === "in_process" || collectionStatus === "pending") {
      router.replace("/payment-pending");
      return;
    }

    if (collectionStatus === "rejected" || collectionStatus === "cancelled") {
      router.replace("/payment-failure");
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
          localStorage.removeItem("cart");
          setStatus("success");
        } else {
          console.error("Error confirmando pago:", await res.text());
          router.replace("/payment-failure");
        }
      })
      .catch((err) => {
        console.error("Error confirmando pago:", err);
        router.replace("/payment-failure");
      });
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)] relative">
        <Navbar />
        <div className="flex justify-center items-center min-h-[40vh] mt-8">
          <p className="text-gray-600">Confirmando tu pago...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)] relative">
      <Navbar />
      <div className="flex justify-center items-center min-h-[40vh] mt-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-green-600">
            ¡Gracias por tu compra!
          </h1>
          <p className="mt-4 text-black">
            Tu pago fue confirmado correctamente.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-bg1 hover:bg-bg2 text-white font-medium px-4 py-2 rounded-md"
          >
            Volver al inicio
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
