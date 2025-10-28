// src/app/(tu-ruta)/OmegaShowcase2.tsx
"use client";

import { useEffect, useMemo, useState, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";
import type { Config, OmegaSection } from "@/lib/config.types";

export default function OmegaShowcase2() {
  // ✅ tu hook devuelve el Config directo
  const config: Config = useConfig();

  // Fallbacks seguros para build/SSR
  const showcase = config?.home?.omegaShowcase ?? {
    rotateMs: 5000,
    defaultActiveId: "omega-soluciones",
    backgroundImage: "/SobreNosotros/bgg.webp",
    sections: [] as OmegaSection[],
  };

  const sections = useMemo<OmegaSection[]>(() => showcase.sections ?? [], [showcase.sections]);

  // Elegimos el "main" (si hay)
  const mainSection = useMemo(
    () => sections.find((s) => s.main) ?? sections.find((s) => s.id === "omega-soluciones"),
    [sections]
  );

  // Secciones de esquinas (excluye la main)
  const cornerSections = useMemo(
    () => sections.filter((s) => s.id !== mainSection?.id),
    [sections, mainSection]
  );

  // Active inicial: defaultActiveId -> existente, sino main -> sino primera
  const initialActive =
    (showcase.defaultActiveId &&
      sections.find((s) => s.id === showcase.defaultActiveId)?.id) ||
    mainSection?.id ||
    sections[0]?.id ||
    "";

  const [activeSection, setActiveSection] = useState<string>(initialActive);

  // Recalcular activo si cambia config/secciones
  useEffect(() => {
    if (!sections.length) return;
    if (!sections.find((s) => s.id === activeSection)) {
      setActiveSection(initialActive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, initialActive]);

  // Rotación automática
  useEffect(() => {
    if (sections.length <= 1) return;
    const ms = Math.max(1000, showcase.rotateMs ?? 5000);
    const interval = setInterval(() => {
      setActiveSection((prev) => {
        const idx = sections.findIndex((s) => s.id === prev);
        const nextIdx = (idx + 1) % sections.length;
        return sections[nextIdx].id;
      });
    }, ms);
    return () => clearInterval(interval);
  }, [sections, showcase.rotateMs]);

  const handleLogoClick = (id: SetStateAction<string>) => setActiveSection(id);

  const activeData = sections.find((s) => s.id === activeSection);

  // 4 esquinas para las secciones que no son "main"
  const cornerPos = [
    "absolute top-2 left-2",
    "absolute top-2 right-2",
    "absolute bottom-2 left-2",
    "absolute bottom-2 right-2",
  ];

  return (
    <div
      id="hero"
      className="bg-no-repeat bg-cover bg-center flex flex-col lg:flex-row items-center justify-center p-2 lg:p-8 min-h-[80vh]"
    >
      <div
        className="relative flex items-center justify-center w-[20rem] lg:w-[29rem] h-[20rem] lg:h-[29rem] bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url('${showcase.backgroundImage ?? "/SobreNosotros/bgg.webp"}')` }}
      >
        {/* Botón central (main) */}
        {mainSection && (
          <button
            key={mainSection.id}
            onClick={() => handleLogoClick(mainSection.id)}
            className={`cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[10rem] lg:w-[15rem] h-[10rem] lg:h-[15rem]
                        rounded-full border-2 ${
                          activeSection === mainSection.id
                            ? "shadow-lg shadow-orange-500 border-orange-500 scale-110"
                            : "shadow-md border-gray-300"
                        } bg-white transition-all duration-300`}
            aria-label={mainSection.title}
          >
            <img
              src={mainSection.logo}
              alt={mainSection.title}
              className={`w-full h-full object-contain rounded-full ${
                activeSection === mainSection.id ? "brightness-110" : ""
              }`}
            />
          </button>
        )}

        {/* Botones de esquinas */}
        {cornerSections.map((section, i) => {
          const isActive = section.id === activeSection;
          return (
            <button
              key={section.id}
              onClick={() => handleLogoClick(section.id)}
              className={`cursor-pointer ${cornerPos[i % cornerPos.length]}
                          w-[5rem] lg:w-[8rem] h-[5rem] lg:h-[8rem]
                          rounded-full border-2 ${
                            isActive ? "shadow-lg shadow-orange-500 border-orange-500 scale-110" : "shadow-md border-gray-300"
                          } bg-white transition-all duration-300`}
              aria-label={section.title}
            >
              <img
                src={section.logo}
                alt={section.title}
                className={`w-full h-full object-contain rounded-full ${isActive ? "brightness-110" : ""}`}
              />
            </button>
          );
        })}
      </div>

      <motion.div
        className="ml-[0rem] lg:ml-[5rem] mt-2 lg:mt-0 text-center lg:text-start lg:pl-[2rem] max-w-[25rem] lg:max-w-[35rem] px-4"
        key={activeSection}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h2 className="pt-[1rem] text-3xl lg:text-4xl font-semibold text-[#f86709]">
          {activeData?.title ?? ""}
        </h2>
        <motion.p
          className="text-lg lg:text-2xl font-bold text-gray-500 mt-[1rem]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {activeData?.description ?? ""}
        </motion.p>
        <div className="pt-[1.5rem]">
          <Link
            className="px-6 py-3 uppercase bg-white text-black font-semibold rounded-full shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            to="tabsDemo"
            smooth={true}
            duration={500}
          >
            Más Información
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
