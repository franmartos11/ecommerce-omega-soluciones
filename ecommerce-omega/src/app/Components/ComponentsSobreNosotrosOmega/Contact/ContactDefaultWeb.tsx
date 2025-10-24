"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMail } from "react-icons/fi";
// Usamos <img> para evitar problemas de dominios de next/image
// Si querés next/image, cambialo y recordá configurar images.remotePatterns/domains
// import Image from "next/image";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";

/* ===== utilidades sin any ===== */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);
const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

type Departamento = {
  title?: string;
  email?: string;
  phone?: string;
};

function isDepartamentoArray(v: unknown): v is Departamento[] {
  return Array.isArray(v) && v.every((x) => isRecord(x));
}

export const ContactComponent = () => {
  const cfg = useConfig();

  // ----- Contactanos -----
  const contactanos = isRecord(cfg.Contactanos) ? cfg.Contactanos : {};
  const textoPrincipal = str(
    contactanos.TextoPrincipal,
    "Ven a visitarnos o contáctanos por teléfono o correo electrónico."
  );

  const logoObj = isRecord(contactanos.Logo) ? contactanos.Logo : undefined;
  const logoSrc =
    str(logoObj?.src) || str(cfg.Logo?.src) || "/SobreNosotros/1.webp";
  const logoAlt = str(logoObj?.alt, str(cfg.Logo?.alt, cfg.sitio?.nombre ?? "Logo"));

  const ubic = isRecord(contactanos.Ubicacion) ? contactanos.Ubicacion : {};
  const lat = num(ubic.lat);
  const lng = num(ubic.lng);
  const mapsUrl = str(ubic.mapsUrl);

  // Construimos un src EMBED si hay lat/lng; si no, intentamos con mapsUrl; sino un fallback
  const mapEmbedSrc = useMemo(() => {
    if (lat !== undefined && lng !== undefined) {
      return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    }
    if (mapsUrl.includes("embed")) return mapsUrl;
    if (mapsUrl) {
      // convertir maps url normal a embed cuando sea posible
      try {
        const u = new URL(mapsUrl);
        const q = u.searchParams.get("q");
        if (q) return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
      } catch {
        /* noop */
      }
    }
    // fallback genérico a la ciudad si existe
    const ciudad = str(ubic.ciudad);
    const provincia = str(ubic.provincia);
    const pais = str(ubic.pais);
    const q = [ciudad, provincia, pais].filter(Boolean).join(", ");
    return q ? `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=12&output=embed` : "https://www.google.com/maps?q=Argentina&z=4&output=embed";
  }, [lat, lng, mapsUrl, ubic.ciudad, ubic.provincia, ubic.pais]);

  // Tel/email por defecto
  const telFallback = str(contactanos.tel, str(cfg.Soporte?.tel, cfg.NumTelefonoSoporte ?? ""));
  const emailFallback = str(contactanos.email, str(cfg.Soporte?.email, ""));

  // Departamentos opcionales (si algún día los agregás al JSON)
  const departamentos: Departamento[] = useMemo(() => {
    const dep = (contactanos as Record<string, unknown>)?.Departamentos;
    if (isDepartamentoArray(dep) && dep.length > 0) {
      return dep.map((d) => ({
        title: str(d.title, "Contacto"),
        email: str(d.email, emailFallback),
        phone: str(d.phone, telFallback),
      }));
    }
    // si no hay departamentos, usamos uno por defecto con tel/email global
    const defaultTitle = cfg.sitio?.nombre ? `Contacto ${cfg.sitio.nombre}` : "Administración";
    return [
      {
        title: defaultTitle,
        email: emailFallback || "contacto@tu-dominio.com",
        phone: telFallback || "+54 9 351 000-0000",
      },
    ];
  }, [contactanos, cfg.sitio?.nombre, emailFallback, telFallback]);

  // helpers
  const toTelHref = (t: string) => `tel:${t.replace(/\s+/g, "")}`;
  const toWaHref = (t: string) => {
    const digits = t.replace(/[^\d]/g, "");
    const withCC = digits.startsWith("54") ? digits : `54${digits}`;
    return `https://wa.me/${withCC}?text=Hola!%20`;
  };

  return (
    <section
      id="contactanos"
      className="px-6 lg:px-12 bg-no-repeat bg-cover bg-center min-h-screen flex flex-col justify-center py-12"
    >
      <div className="container mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Imagen del logo */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          
          <img
            src={logoSrc}
            alt={logoAlt}
            width={320}
            height={320}
            className="w-[12rem] lg:w-[20rem] h-[12rem] lg:h-[20rem] rounded-full shadow-lg object-cover"
          />
        </motion.div>

        {/* Información de contacto */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl uppercase text-black font-bold lg:text-5xl">
            Contáctanos
          </h2>
          <p className="text-black text-lg lg:text-xl">
            {textoPrincipal}
          </p>

          {/* Lista de contactos desde JSON (o fallback) */}
          <div className="space-y-6">
            {departamentos.map(({ title, email, phone }, index) => (
              <div key={`${title}-${index}`}>
                <p className="text-xl text-black font-semibold">{title}</p>

                {email && (
                  <div className="flex items-center gap-4 mt-0">
                    <FiMail className="text-black h-[1rem] w-5" />
                    <a
                      href={`mailto:${email}`}
                      className="text-black text-lg hover:text-[#f86709]"
                    >
                      {email}
                    </a>
                  </div>
                )}

                {phone && (
                  <div className="flex items-center gap-4 mt-0">
                    <FiPhone className="text-black h-[1rem] w-5" />
                    <a
                      href={toWaHref(phone)}
                      className="text-black text-lg hover:text-[#f86709]"
                      title="Enviar WhatsApp"
                    >
                      {phone}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mapa (derivado de lat/lng o mapsUrl del JSON) */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-6 mx-auto w-full max-w-6xl shadow-lg rounded-lg overflow-hidden"
      >
        <iframe
          src={mapEmbedSrc}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Ubicación en el mapa"
        />
      </motion.div>
    </section>
  );
};
