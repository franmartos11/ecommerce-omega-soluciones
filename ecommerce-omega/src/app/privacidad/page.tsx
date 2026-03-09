"use client";

import React, { useState } from "react";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { ChevronDown, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  title: string;
  content: string;
}

const sections: Section[] = [
  {
    title: "1. Información que Recopilamos",
    content:
      "Recopilamos información personal que usted nos proporciona directamente al registrarse, realizar una compra o contactarnos. Esto incluye: nombre completo, dirección de correo electrónico, dirección postal, número de teléfono y datos de facturación. También recopilamos información de uso del sitio de forma automática mediante cookies y tecnologías similares.",
  },
  {
    title: "2. Cómo Usamos su Información",
    content:
      "Utilizamos su información personal para: procesar y gestionar sus pedidos, enviar confirmaciones y actualizaciones de envío, responder a sus consultas de soporte, personalizar su experiencia de compra, enviar comunicaciones de marketing (previo consentimiento), mejorar nuestro sitio web y servicios, y cumplir con obligaciones legales.",
  },
  {
    title: "3. Compartir Información con Terceros",
    content:
      "No vendemos ni alquilamos su información personal. Podemos compartirla con: proveedores de servicios de pago (Mercado Pago) para procesar transacciones, empresas de logística para la entrega de productos, proveedores de servicios de email para comunicaciones transaccionales, y autoridades legales cuando sea requerido por ley.",
  },
  {
    title: "4. Cookies y Tecnologías de Rastreo",
    content:
      "Utilizamos cookies esenciales para el funcionamiento del sitio (sesión, carrito de compras), cookies analíticas para comprender cómo los usuarios interactúan con nuestro sitio, y cookies de preferencias para recordar sus configuraciones. Puede configurar su navegador para rechazar cookies, aunque esto podría afectar la funcionalidad del sitio.",
  },
  {
    title: "5. Seguridad de los Datos",
    content:
      "Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye encriptación SSL/TLS, acceso restringido a datos personales, y auditorías regulares de seguridad. Sin embargo, ningún método de transmisión por Internet es 100% seguro.",
  },
  {
    title: "6. Sus Derechos",
    content:
      "De acuerdo con la Ley de Protección de Datos Personales (Ley 25.326), usted tiene derecho a: acceder a su información personal, solicitar la rectificación de datos inexactos, solicitar la supresión de sus datos, retirar su consentimiento para comunicaciones de marketing, y presentar una queja ante la autoridad de control (AAIP). Para ejercer estos derechos, contacte a nuestro equipo de soporte.",
  },
  {
    title: "7. Retención de Datos",
    content:
      "Conservamos su información personal mientras sea necesario para cumplir con los fines para los cuales fue recopilada, incluyendo obligaciones legales, contables y de reporte. Los datos relacionados con compras se conservan por el período legalmente establecido para fines fiscales.",
  },
  {
    title: "8. Cambios en esta Política",
    content:
      "Nos reservamos el derecho de actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos mediante un aviso en nuestro sitio web o por correo electrónico. Le recomendamos revisar esta política regularmente.",
  },
];

function Accordion({ section }: { section: Section }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
        style={{ background: open ? "var(--color-primary-bg)" : "white" }}
      >
        <span
          className="font-semibold text-sm md:text-base"
          style={{ color: open ? "var(--color-tertiary-text)" : "var(--color-primary-text)" }}
        >
          {section.title}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5" style={{ color: open ? "var(--color-tertiary-text)" : "var(--color-secondary-text)" }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 text-sm leading-relaxed bg-gray-50/80" style={{ color: "var(--color-secondary-text)" }}>
              {section.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]" style={{ background: "var(--bgweb)" }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" style={{ color: "var(--color-primary-bg)" }} />
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--color-primary-text)" }}>
            Política de Privacidad
          </h1>
        </div>
        <p className="text-sm mb-8" style={{ color: "var(--color-secondary-text)" }}>
          Última actualización: Marzo 2026
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm" style={{ color: "#1e40af" }}>
          Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información personal.
        </div>
        <div className="space-y-3">
          {sections.map((s, i) => (
            <Accordion key={i} section={s} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
