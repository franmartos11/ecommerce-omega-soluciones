"use client";

import { useMemo } from "react";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";
import { Tabs } from "./Tabs/Tabs";

type TabCfg = {
  title?: string;
  subtitle?: string;
  img?: string;
};

function isNonEmpty(s?: string): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const bgVariants = [
  "bg-gradient-to-br from-purple-700 to-violet-900",
  "bg-gradient-to-br from-sky-600 to-blue-900",
  "bg-gradient-to-br from-emerald-600 to-emerald-900",
  "bg-gradient-to-br from-rose-600 to-rose-900",
  "bg-gradient-to-br from-amber-600 to-orange-900",
];

export function TabsSection() {
  const cfg = useConfig();

  // 1) Leer de DefaultWeb.TabsSection
  const raw = cfg?.DefaultWeb as Record<string, unknown> | undefined;
  const rawTabs = (raw?.TabsSection ?? {}) as Record<string, unknown>;

  // 2) Normalizar 1..5
  const tabsFromConfig: TabCfg[] = useMemo(() => {
    const out: TabCfg[] = [];
    for (let i = 1; i <= 5; i++) {
      const t = (rawTabs[`Tabs${i}Title`] ??
        rawTabs[`Tab${i}Title`] ??
        rawTabs[`Tab${i}Titulo`]) as string | undefined;

      const st = (rawTabs[`Tab${i}Subtitle`] ??
        rawTabs[`Tabs${i}Subtitle`] ??
        rawTabs[`Tab${i}Subtitulo`]) as string | undefined;

      const img = (rawTabs[`Tab${i}Img`] ??
        rawTabs[`Tabs${i}Img`] ??
        rawTabs[`Tab${i}Image`]) as string | undefined;

      // si no hay NADA en el slot, lo omitimos
      if (!isNonEmpty(t) && !isNonEmpty(st) && !isNonEmpty(img)) continue;

      out.push({
        title: isNonEmpty(t) ? t : `Tab ${i}`,
        subtitle: isNonEmpty(st) ? st : "",
        img: isNonEmpty(img) ? img : "/linear.webp",
      });
    }
    return out;
  }, [rawTabs]);

  // 3) Fallback demo si config está vacío
  const safeTabs: TabCfg[] =
    tabsFromConfig.length > 0
      ? tabsFromConfig
      : [
          { title: "Product", subtitle: "Product Tabs", img: "/linear.webp" },
          { title: "Services", subtitle: "Services tab", img: "/linear.webp" },
          { title: "Playground", subtitle: "Playground tab", img: "/linear.webp" },
          { title: "Content", subtitle: "Content tab", img: "/linear.webp" },
          { title: "Random", subtitle: "Random tab", img: "/linear.webp" },
        ];

  // 4) Adaptar al shape que espera <Tabs />
  const tabs = safeTabs.map((t, idx) => {
    const bg = bgVariants[idx % bgVariants.length];
    const value = slugify(t.title ?? `tab-${idx + 1}`);

    return {
      title: t.title ?? `Tab ${idx + 1}`,
      value,
      content: (
        <div className={`w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white ${bg}`}>
          <p>{t.subtitle || t.title}</p>
          <img
            src={t.img || "/linear.webp"}
            alt={t.title || `Tab ${idx + 1}`}
            width={1000}
            height={1000}
            className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
          />
        </div>
      ),
    };
  });

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-40"style={{ background: "var(--bgweb)"}}>
      <Tabs tabs={tabs} />
    </div>
  );
}
