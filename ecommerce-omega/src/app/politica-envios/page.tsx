"use client";

import React, { useState } from "react";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { ChevronDown, Truck, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  title: string;
  content: string;
}

const envioSections: Section[] = [
  {
    title: "Zonas de Cobertura",
    content:
      "Realizamos envíos a todo el territorio de la República Argentina. Los tiempos de entrega varían según la localidad: AMBA (24-48 horas hábiles), Interior del país (3-7 días hábiles), Zonas alejadas (5-10 días hábiles). Los plazos son estimativos y pueden variar según la demanda y disponibilidad del servicio logístico.",
  },
  {
    title: "Costos de Envío",
    content:
      "El costo de envío se calcula automáticamente al ingresar su código postal durante el proceso de compra. Ofrecemos envío gratuito en compras superiores al monto mínimo establecido (visible al momento de la compra). Para envíos especiales o productos de gran tamaño, el costo puede variar.",
  },
  {
    title: "Seguimiento del Pedido",
    content:
      "Una vez despachado su pedido, recibirá un correo electrónico con el número de seguimiento para rastrear el estado de su envío. También puede consultar el estado de sus pedidos desde su panel de usuario en nuestro sitio web.",
  },
  {
    title: "Recepción del Paquete",
    content:
      "El paquete será entregado en la dirección indicada durante la compra. Es importante que alguien se encuentre disponible para recibir el pedido. En caso de ausencia, el servicio de correo dejará un aviso e intentará una segunda entrega o el paquete quedará disponible para retiro en la sucursal más cercana.",
  },
];

const devolucionSections: Section[] = [
  {
    title: "Plazo para Devoluciones",
    content:
      "Tiene 30 días corridos desde la recepción del producto para solicitar una devolución o cambio. Pasado este plazo, no se aceptarán devoluciones salvo por defectos de fabricación cubiertos por garantía.",
  },
  {
    title: "Condiciones del Producto",
    content:
      "Para que una devolución sea aceptada, el producto debe: encontrarse sin uso y en su estado original, conservar todos los empaques, etiquetas y accesorios originales, incluir la factura o comprobante de compra. No se aceptan devoluciones de productos personalizados, ropa interior, productos de higiene personal o alimentos perecederos.",
  },
  {
    title: "Proceso de Devolución",
    content:
      "Para iniciar una devolución: 1) Contacte a nuestro equipo de soporte por email o WhatsApp indicando el número de pedido. 2) Recibirá instrucciones para el envío del producto. 3) Una vez recibido y verificado el producto, procesaremos el reembolso o cambio dentro de los 10 días hábiles. 4) El reembolso se realizará por el mismo medio de pago utilizado en la compra.",
  },
  {
    title: "Productos Defectuosos",
    content:
      "Si recibe un producto defectuoso o diferente al solicitado, contáctenos inmediatamente. En estos casos, el costo de envío de la devolución corre por nuestra cuenta y recibirá un reemplazo o reembolso total, incluyendo los gastos de envío originales.",
  },
  {
    title: "Derecho de Arrepentimiento",
    content:
      "Conforme a la Ley 24.240 de Defensa del Consumidor, en compras realizadas a distancia, usted tiene derecho a revocar la aceptación del producto dentro de los 10 días corridos desde su recepción, sin necesidad de justificación. Los gastos de devolución en este caso corren por cuenta del comprador.",
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

export default function PoliticaEnviosPage() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]" style={{ background: "var(--bgweb)" }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Envíos */}
        <div className="flex items-center gap-3 mb-2">
          <Truck className="w-8 h-8" style={{ color: "var(--color-primary-bg)" }} />
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--color-primary-text)" }}>
            Política de Envíos
          </h1>
        </div>
        <p className="text-sm mb-6" style={{ color: "var(--color-secondary-text)" }}>
          Última actualización: Marzo 2026
        </p>
        <div className="space-y-3 mb-12">
          {envioSections.map((s, i) => (
            <Accordion key={`e-${i}`} section={s} />
          ))}
        </div>

        {/* Devoluciones */}
        <div className="flex items-center gap-3 mb-2">
          <RotateCcw className="w-8 h-8" style={{ color: "var(--color-primary-bg)" }} />
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--color-primary-text)" }}>
            Política de Devoluciones
          </h1>
        </div>
        <p className="text-sm mb-6" style={{ color: "var(--color-secondary-text)" }}>
          Garantizamos tu satisfacción con cada compra
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm" style={{ color: "#166534" }}>
          ✅ 30 días para devoluciones · Reembolso garantizado · Soporte dedicado
        </div>
        <div className="space-y-3">
          {devolucionSections.map((s, i) => (
            <Accordion key={`d-${i}`} section={s} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
