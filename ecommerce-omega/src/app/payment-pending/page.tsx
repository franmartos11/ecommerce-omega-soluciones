"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/NavigationBar/NavBar";

export default function PaymentPending() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)] relative">
      <Navbar />
      {/* Contenedor que centra vertical y horizontalmente */}
      <div className="flex justify-center items-center min-h-[40vh] mt-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-yellow-600">
            Pago pendiente de confirmación
          </h1>
          <p className="mt-4 text-black">
            Tu pago está siendo procesado. Te avisaremos cuando se confirme.
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
