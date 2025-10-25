"use client";

import React, { useMemo } from "react";
import { Timeline } from "./Timeline/Timeline";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";

/**
 * Estructura esperada en config.json (DefaultWeb.MyJourney):
 * {
 *   "Title": "Mi viaje",
 *   "SubTitle": "Cómo crecimos",
 *   "Year1": "2023",
 *   "SubtitleYear1": "Lanzamiento",
 *   "Img1Year1": "...", "Img2Year1": "...", "Img3Year1": "...", "Img4Year1": "...",
 *   "Year2": "2024",
 *   "SubtitleYear2": "...",
 *   "Img1Year2": "...", ...,
 *   "Year3": "2025",
 *   "SubtitleYear3": "...",
 *   "Img1Year3": "...", ...
 * }
 * 
 * Lee hasta 3 etapas (Year1..Year3), cada una con título, subtítulo y hasta 4 imágenes por año
 * 
 */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);
const nonEmpty = (s?: string) => typeof s === "string" && s.trim().length > 0;

type YearBlock = {
  title: string;        // "2024"
  subtitle?: string;    // "Lanzamos X"
  images: string[];     // hasta 4
};

export function TimelineSection() {
  const cfg = useConfig();
  const defaultWeb = isRecord(cfg?.DefaultWeb) ? (cfg!.DefaultWeb as Record<string, unknown>) : {};
  const myJourney = isRecord(defaultWeb.MyJourney) ? (defaultWeb.MyJourney as Record<string, unknown>) : {};

  const pageTitle = str(myJourney.Title, "Mi camino");
  const pageSubtitle = str(myJourney.SubTitle, "");

  const years: YearBlock[] = useMemo(() => {
    const extractYear = (idx: 1 | 2 | 3): YearBlock | null => {
      const y = str(myJourney[`Year${idx}`], "");
      const sub = str(myJourney[`SubtitleYear${idx}`], "");
      const imgs = [
        str(myJourney[`Img1Year${idx}`], ""),
        str(myJourney[`Img2Year${idx}`], ""),
        str(myJourney[`Img3Year${idx}`], ""),
        str(myJourney[`Img4Year${idx}`], ""),
      ].filter(nonEmpty);

      // si no hay ni año, ni subtítulo, ni imágenes, omitimos el bloque
      if (!nonEmpty(y) && !nonEmpty(sub) && imgs.length === 0) return null;

      return {
        title: nonEmpty(y) ? y : `Fase ${idx}`,
        subtitle: sub,
        images: imgs.length > 0 ? imgs : ["/linear.webp"],
      };
    };

    const out = [extractYear(1), extractYear(2), extractYear(3)].filter(
      (x): x is YearBlock => x !== null
    );

    // fallback demo si no hay nada en config
    if (out.length === 0) {
      return [
        {
          title: "2024",
          subtitle: "Lanzamos la primera versión del producto",
          images: [
            "https://assets.aceternity.com/templates/startup-1.webp",
            "https://assets.aceternity.com/templates/startup-2.webp",
            "https://assets.aceternity.com/templates/startup-3.webp",
            "https://assets.aceternity.com/templates/startup-4.webp",
          ],
        },
        {
          title: "2023",
          subtitle: "Crecimos el equipo y el portfolio",
          images: [
            "https://assets.aceternity.com/pro/hero-sections.png",
            "https://assets.aceternity.com/features-section.png",
            "https://assets.aceternity.com/pro/bento-grids.png",
            "https://assets.aceternity.com/cards.png",
          ],
        },
        {
          title: "Changelog",
          subtitle: "Nuevos componentes y mejoras",
          images: [
            "https://assets.aceternity.com/pro/hero-sections.png",
            "https://assets.aceternity.com/features-section.png",
            "https://assets.aceternity.com/pro/bento-grids.png",
            "https://assets.aceternity.com/cards.png",
          ],
        },
      ];
    }

    return out;
  }, [myJourney]);

  // Adaptar a lo que espera <Timeline />: [{ title, content }]
  const data = useMemo(
    () =>
      years.map((b) => ({
        title: b.title,
        content: (
          <div>
            {(nonEmpty(pageTitle) || nonEmpty(pageSubtitle) || nonEmpty(b.subtitle)) && (
              <div className="mb-6">
                {nonEmpty(pageTitle) && (
                  <p className="text-xs md:text-sm font-semibold "style={{color:"var(--color-primary-text)"}}>
                    {pageTitle}
                  </p>
                )}
                {nonEmpty(pageSubtitle) && (
                  <p className="text-[11px] md:text-xs " style={{color:"var(--color-secondary-text)"}}>
                    {pageSubtitle}
                  </p>
                )}
              </div>
            )}

            {nonEmpty(b.subtitle) && (
              <p className="mb-8 text-xs md:text-sm font-normal" style={{ color:"var(--color-primary-text)"}}>
                {b.subtitle}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              {b.images.map((src, i) => (
                <img
                  key={`${b.title}-${i}`}
                  src={src}
                  alt={`${b.title} ${i + 1}`}
                  width={500}
                  height={500}
                  className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),_0_1px_1px_rgba(0,0,0,0.05),_0_0_0_1px_rgba(34,42,53,0.04),_0_0_4px_rgba(34,42,53,0.08),_0_16px_68px_rgba(47,48,55,0.05),_0_1px_0_rgba(255,255,255,0.1)_inset] md:h-44 lg:h-60"
                />
              ))}
            </div>
          </div>
        ),
      })),
    [years, pageTitle, pageSubtitle]
  );

  return (
    <div className="relative w-full overflow-clip" style={{ background: "var(--bgweb)"}}>
      <Timeline data={data} />
    </div>
  );
}
