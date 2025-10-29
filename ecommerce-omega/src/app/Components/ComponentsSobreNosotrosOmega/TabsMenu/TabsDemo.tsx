"use client";

import { Tabs } from "./Tabs";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";
import type { Config, BusinessTabsConfig, BusinessTabItem } from "@/lib/config.types";

export function TabsDemo() {
  const [titleRef, titleInView] = useInView({ triggerOnce: true });
  const [tabsRef, tabsInView] = useInView({ triggerOnce: true });

  // ✅ tu hook devuelve el Config directo
  const config: Config = useConfig();

  // Fallbacks + override desde JSON (sin tocar clases)
  const cfg: BusinessTabsConfig = {
    sectionId: "tabsDemo",
    heading: "UNIDADES DE NEGOCIO",
    backgroundImage: undefined,
    accentColorClass: "bg-orange-500",
    textColorClass: "text-black",
    containerHeights: { base: "34rem", md: "37rem" }, // solo por referencia, NO se usan para clases
    items: [
      // Fallback para no romper si aún no cargó el JSON (misma data que tenías)
      {
        value: "product",
        link: "/carcheck",
        logo: "/SobreNosotros/33.webp",
        src: "/SobreNosotros/19.png",
        alt: "OmegaDistribucionesLogo",
        title: "carcheck-data",
      },
      {
        value: "services",
        link: "/auditorias",
        logo: "/SobreNosotros/4c.webp",
        src: "/SobreNosotros/20.png",
        alt: "OmegaConstruccionesLogo",
        title: "Auditorias-data",
      },
      {
        value: "playground",
        link: "/desarrollo-web",
        logo: "/SobreNosotros/1cc.webp",
        src: "/SobreNosotros/21.png",
        alt: "OmegaCleanLogo",
        title: "Paginas-Web-data",
      },
      {
        value: "content",
        link: "/apps-a-medida",
        logo: "/SobreNosotros/2t.webp",
        src: "/SobreNosotros/omegatech.png",
        alt: "OmegaTechLogo",
        title: "Apps-a-Medida-data",
      },
    ],
    ...(config?.home?.businessTabs ?? {}),
  };

  // Mantengo el background opcional sin tocar las clases
  const bgStyle = cfg.backgroundImage ? { backgroundImage: `url('${cfg.backgroundImage}')` } : undefined;

  // Los tabs que consume tu <Tabs />
  const tabs: BusinessTabItem[] = (cfg.items ?? []) as BusinessTabItem[];

  return (
    <div
      className="bg-no-repeat bg-cover bg-center sm:pt-[4rem] sm:min-h-[100vh]"
      id={cfg.sectionId ?? "tabsDemo"}
      style={bgStyle}
    >
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 50 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="container px-6 pt-7 pb-0 mx-auto sm:pt-0"
      >
        <h2 className={`text-4xl ${cfg.textColorClass ?? "text-black"} pt-16 font-semibold text-center capitalize lg:text-6xl`}>
          {cfg.heading ?? "UNIDADES DE NEGOCIO"}
        </h2>
        <div className="flex justify-center mx-auto mt-6">
          <span className={`inline-block w-40 h-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`}></span>
          <span className={`inline-block w-3 h-1 mx-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`}></span>
          <span className={`inline-block w-1 h-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`}></span>
        </div>
      </motion.div>

      {/* 👇🏻 Conservamos tus clases tal cual */}
      <motion.div
        ref={tabsRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={tabsInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-[34rem] md:h-[37rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full align-middle items-start justify-start mt-10"
      >
        <Tabs tabs={tabs} />
      </motion.div>
    </div>
  );
}
