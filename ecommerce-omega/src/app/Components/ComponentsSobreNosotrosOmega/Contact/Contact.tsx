// src/app/(tu-ruta)/ContactComponent.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMail } from "react-icons/fi";
import Image from "next/image";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";
import type { Config, ContactEntry, ContactSectionConfig } from "@/lib/config.types";

export const ContactComponent = () => {
  // ✅ tu hook devuelve el Config directo
  const config: Config = useConfig();

  // Fallback seguro (por si aún no cargó el JSON)
  const cfg: ContactSectionConfig = {
    sectionId: "contactanos",
    backgroundImage: undefined,
    heading: "Contáctanos",
    subtitle: "Ven a visitarnos o contáctanos por teléfono o correo electrónico.",
    logo: {
      src: "/SobreNosotros/1.webp",
      alt: "Omega Logo",
      width: 300,
      height: 300,
      rounded: true,
    },
    contacts: [
      // Si querés, podés dejar vacío y se oculta la lista
    ],
    map: {
      iframeSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4917.1284462890555!2d-65.41137!3d-24.7618653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc36adcbf6bd9%3A0x9db0642ee2c946ce!2sOmega%20Soluciones!5e0!3m2!1ses-419!2sar!4v1699621807831!5m2!1ses-419!2sar",
      height: 300,
    },
    // 🔽 override con lo que venga del JSON
    ...(config?.home?.contact ?? {}),
  };

  const toWhatsAppHref = (entry: ContactEntry) => {
    if (!entry.phone) return undefined;
    const digits = entry.phone.replace(/[^0-9]/g, "");
    const prefix = entry.whatsapp?.internationalPrefix ?? "549";
    const msg = entry.whatsapp?.defaultText ?? "Hola!%20";
    const waNumber = digits.startsWith(prefix) ? digits : `${prefix}${digits}`;
    return `https://wa.me/${waNumber}?text=${msg}`;
  };

  const toTelHref = (phone?: string) =>
    phone ? `tel:${phone.replace(/[^0-9+]/g, "")}` : undefined;

  const bgStyle =
    cfg.backgroundImage ? { backgroundImage: `url('${cfg.backgroundImage}')` } : undefined;

  return (
    <section
      id={cfg.sectionId ?? "contactanos"}
      className="px-6 lg:px-12 bg-no-repeat bg-cover bg-center min-h-screen flex flex-col justify-center py-12"
      style={bgStyle}
    >
      <div className="container mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Imagen del logo */}
        {cfg.logo?.src && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Image
              src={cfg.logo.src}
              alt={cfg.logo.alt ?? "Logo"}
              width={cfg.logo.width ?? 300}
              height={cfg.logo.height ?? 300}
              className={`w-[12rem] lg:w-[20rem] h-[12rem] lg:h-[20rem] ${
                cfg.logo.rounded !== false ? "rounded-full" : ""
              } shadow-lg`}
              priority
            />
          </motion.div>
        )}

        {/* Información de contacto */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {cfg.heading && (
            <h2 className="text-3xl uppercase text-black font-bold lg:text-5xl">
              {cfg.heading}
            </h2>
          )}
          {cfg.subtitle && (
            <p className="text-black text-lg lg:text-xl">{cfg.subtitle}</p>
          )}

          {/* Lista de contactos */}
          {!!cfg.contacts?.length && (
            <div className="space-y-6">
              {cfg.contacts.map((item, index) => {
                const waHref =
                  item.whatsapp?.enabled && item.phone ? toWhatsAppHref(item) : undefined;
                const telHref = !waHref ? toTelHref(item.phone) : undefined;

                return (
                  <div key={index}>
                    <p className="text-xl text-black font-semibold">{item.title}</p>

                    {item.email && (
                      <div className="flex items-center gap-4 mt-0">
                        <FiMail className="text-black h-[1rem] w-5" />
                        <a
                          href={`mailto:${item.email}`}
                          className="text-black text-lg hover:text-[#f86709]"
                        >
                          {item.email}
                        </a>
                      </div>
                    )}

                    {item.phone && (
                      <div className="flex items-center gap-4 mt-0">
                        <FiPhone className="text-black h-[1rem] w-5" />
                        <a
                          href={waHref ?? telHref}
                          className="text-black text-lg hover:text-[#f86709]"
                          target={waHref ? "_blank" : undefined}
                          rel={waHref ? "noopener noreferrer" : undefined}
                          title={
                            waHref ? "Chatear por WhatsApp" : "Llamar por teléfono"
                          }
                        >
                          {item.phone}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Mapa */}
      {cfg.map?.iframeSrc && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-6 mx-auto w-full max-w-6xl shadow-lg rounded-lg overflow-hidden"
        >
          <iframe
            src={cfg.map.iframeSrc}
            width="100%"
            height={String(cfg.map.height ?? 300)}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Ubicación en el mapa"
          />
        </motion.div>
      )}
    </section>
  );
};

export default ContactComponent;
