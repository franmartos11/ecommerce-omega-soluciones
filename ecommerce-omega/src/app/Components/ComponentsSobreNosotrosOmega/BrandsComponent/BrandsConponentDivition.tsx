"use client";

import React, { useMemo, useRef, useState } from "react";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";
import type { Config, BrandsSectionConfig, BrandItem, BrandCategory } from "@/lib/config.types";

const BrandsComponentDivition: React.FC = () => {
  const config: Config = useConfig();

  const cfg: BrandsSectionConfig = {
    sectionId: "marcas",
    heading: "TRABAJAMOS CON LAS MEJORES MARCAS",
    backgroundImage: undefined,
    accentColorClass: "bg-orange-500",
    textColorClass: "text-black",
    initialCategory: undefined,
    gridCols: { base: 2, sm: 4, lg: 6 },
    logoSizeRem: 4,
    items: [],
    ...(config?.home?.brands ?? {}),
  };

  const grouped = useMemo(() => {
    const acc: Record<string, BrandItem[]> = {};
    (cfg.items ?? []).forEach((b) => {
      if (!acc[b.type]) acc[b.type] = [];
      acc[b.type].push(b);
    });
    return acc;
  }, [cfg.items]);

  const categories: BrandCategory[] = useMemo(() => {
    if (cfg.categories?.length) {
      return cfg.categories
        .filter((c) => grouped[c.name]?.length)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name }));
  }, [cfg.categories, grouped]);

  const initialVisible =
    cfg.initialCategory === null
      ? null
      : cfg.initialCategory && grouped[cfg.initialCategory]
      ? cfg.initialCategory
      : categories[0]?.name ?? null;

  const [visibleCategory, setVisibleCategory] = useState<string | null>(initialVisible);
  const brandsRef = useRef<HTMLDivElement | null>(null);

  const handleCategoryClick = (type: string) => {
    setVisibleCategory((prev) => (prev === type ? null : type));
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setTimeout(() => {
        if (brandsRef.current) {
          window.scrollTo({ top: brandsRef.current.offsetTop - 120, behavior: "smooth" });
        }
      }, 200);
    }
  };

  const bgStyle = cfg.backgroundImage ? { backgroundImage: `url('${cfg.backgroundImage}')` } : undefined;
  const gridClass = `grid grid-cols-${cfg.gridCols?.base ?? 2} sm:grid-cols-${cfg.gridCols?.sm ?? 4} lg:grid-cols-${cfg.gridCols?.lg ?? 6} gap-6`;
  const logoSize = `${cfg.logoSizeRem ?? 4}rem`;

  return (
    <section id={cfg.sectionId ?? "marcas"} className="min-h-screen pt-20 py-20 px-4 text-center bg-cover bg-center bg-no-repeat" style={bgStyle}>
      <div className="container mx-auto">
        {cfg.heading && (
          <h2 className={`text-4xl font-semibold text-center capitalize lg:text-6xl ${cfg.textColorClass ?? "text-black"}`}>
            {cfg.heading}
          </h2>
        )}
        <div className="flex justify-center mx-auto mt-4">
          <span className={`inline-block w-20 h-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`} />
          <span className={`inline-block w-10 h-1 mx-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`} />
          <span className={`inline-block w-5 h-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`} />
          <span className={`inline-block w-20 h-1 ${cfg.accentColorClass ?? "bg-orange-500"} rounded-full`} />
        </div>
      </div>

      <div className="container mx-auto mt-10">
        {/* Botones de categorías — FIX de estilos activos */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => {
            const isActive = visibleCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                aria-pressed={isActive}
                className={[
                  " cursor-pointer w-[48%] sm:w-auto px-6 py-3 uppercase text-xs sm:text-sm sm:font-semibold font-extralight rounded-lg shadow-lg transition-colors duration-300 text-center focus:outline-none focus:ring-2 focus:ring-offset-2",
                  "text-white", // siempre texto blanco
                  isActive
                    ? "bg-[#f86709] hover:bg-[#e25f08] focus:ring-[#f86709]" // 🔶 naranja activo
                    : "bg-orange-500 hover:bg-orange-600 focus:ring-orange-400", // 🟧 naranja inactivo
                ].join(" ")}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Grid de marcas */}
        {visibleCategory && grouped[visibleCategory] && (
          <div ref={brandsRef} className="mt-10">
            <h3 className={`text-2xl font-bold text-left ${cfg.textColorClass ?? "text-black"} mb-4`}>{visibleCategory}</h3>
            <div className={gridClass}>
              {grouped[visibleCategory].map((brand, index) => {
                const inner = (
                  <div className="flex items-center justify-center bg-white rounded-lg shadow-md p-4 hover:bg-orange-300 transition duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      title={brand.name}
                      className="object-contain"
                      style={{ height: logoSize, width: logoSize }}
                    />
                  </div>
                );
                return brand.href ? (
                  <a key={`${brand.name}-${index}`} href={brand.href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div key={`${brand.name}-${index}`}>{inner}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrandsComponentDivition;
