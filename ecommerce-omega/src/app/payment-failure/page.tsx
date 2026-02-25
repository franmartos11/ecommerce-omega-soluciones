"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";

export default function PaymentFailure() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)] relative">
      <Navbar />
      {/* Contenedor que centra vertical y horizontalmente */}
      <div className="flex justify-center items-center min-h-[40vh] mt-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600">
            El pago no pudo completarse
          </h1>
          <p className="mt-4 text-black">
            Tu pago fue rechazado o cancelado. Puedes intentar nuevamente.
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
