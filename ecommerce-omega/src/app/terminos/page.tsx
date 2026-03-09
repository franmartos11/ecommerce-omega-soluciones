"use client";

import React, { useState } from "react";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  title: string;
  content: string;
}

const sections: Section[] = [
  {
    title: "1. Aceptación de los Términos",
    content:
      "Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos y Condiciones, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.",
  },
  {
    title: "2. Uso de la Tienda",
    content:
      "Los productos y servicios ofrecidos en nuestra tienda están destinados a usuarios mayores de 18 años. Al realizar una compra, usted declara tener la capacidad legal para celebrar contratos vinculantes. Nos reservamos el derecho de rechazar o cancelar pedidos a nuestra discreción, incluyendo pero no limitado a: disponibilidad de producto, errores en la descripción o precio, o sospecha de fraude.",
  },
  {
    title: "3. Precios y Pagos",
    content:
      "Todos los precios mostrados incluyen IVA salvo que se indique lo contrario. Nos reservamos el derecho de modificar precios sin previo aviso. Los métodos de pago aceptados incluyen Mercado Pago, transferencia bancaria y pago en el local. El procesamiento de pagos se realiza de forma segura a través de pasarelas certificadas.",
  },
  {
    title: "4. Productos y Disponibilidad",
    content:
      "Las imágenes de los productos son meramente ilustrativas. Hacemos nuestro mejor esfuerzo por describir con precisión nuestros productos, pero no garantizamos que las descripciones, colores o contenido sean exactos, completos o actualizados. La disponibilidad de productos está sujeta a cambios sin previo aviso.",
  },
  {
    title: "5. Envíos y Entregas",
    content:
      "Los plazos de entrega son estimativos y pueden variar según la zona de entrega y la disponibilidad del servicio de logística. No nos hacemos responsables por demoras causadas por el servicio de correo o transporte. Para más detalles, consulte nuestra Política de Envíos.",
  },
  {
    title: "6. Devoluciones y Cambios",
    content:
      "Los productos pueden ser devueltos o cambiados dentro de los 30 días corridos posteriores a la recepción, siempre que se encuentren en su embalaje original, sin uso y con todos los accesorios. Para iniciar una devolución, contacte a nuestro equipo de soporte. Los costos de envío de la devolución corren por cuenta del comprador, salvo que el producto presente defectos de fábrica.",
  },
  {
    title: "7. Propiedad Intelectual",
    content:
      "Todo el contenido de este sitio web, incluyendo textos, gráficos, logos, íconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de nuestra empresa o de nuestros proveedores de contenido y está protegido por las leyes de propiedad intelectual argentinas e internacionales.",
  },
  {
    title: "8. Limitación de Responsabilidad",
    content:
      "En ningún caso seremos responsables por daños directos, indirectos, incidentales, especiales, consecuentes o punitivos que resulten del uso o la imposibilidad de uso de nuestros servicios o productos. Esta limitación se aplica independientemente de si la responsabilidad se basa en contrato, agravio, negligencia, responsabilidad estricta u otra base legal.",
  },
  {
    title: "9. Modificaciones",
    content:
      "Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigencia inmediatamente después de su publicación en el sitio web. El uso continuado del sitio después de la publicación de cambios constituye la aceptación de dichos cambios.",
  },
  {
    title: "10. Ley Aplicable",
    content:
      "Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de la República Argentina. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción de los tribunales competentes de la Ciudad Autónoma de Buenos Aires.",
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

export default function TerminosPage() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]" style={{ background: "var(--bgweb)" }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--color-primary-text)" }}>
          Términos y Condiciones
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-secondary-text)" }}>
          Última actualización: Marzo 2026
        </p>
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
