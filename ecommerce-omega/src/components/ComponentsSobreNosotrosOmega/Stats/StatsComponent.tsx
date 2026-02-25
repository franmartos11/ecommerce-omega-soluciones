"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";
import type { Config, StatItem, StatsSectionConfig } from "@/lib/config.types";

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

const animateNumber = (
  from: number,
  to: number,
  durationMs: number,
  cb: (v: number) => void
) => {
  const start = performance.now();
  const d = Math.max(200, durationMs || 2000); // piso para evitar “saltos”
  let raf = 0;

  const tick = (t: number) => {
    const p = clamp((t - start) / d, 0, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - p, 3);
    const val = from + (to - from) * eased;
    cb(val);
    if (p < 1) raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
};

const StatCard: React.FC<{
  item: StatItem;
  visible: boolean;
  accentClass: string;
  textClass: string;
}> = ({ item, visible, accentClass, textClass }) => {
  const [val, setVal] = useState(0);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!visible) return;
    stopRef.current?.();
    stopRef.current = animateNumber(0, item.value, item.durationMs ?? 2000, setVal);
    return () => stopRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, item.value, item.durationMs]);

  const decimals = item.decimals ?? 0;
  const shown = useMemo(() => {
    const n = Number(val.toFixed(decimals));
    const prefix = item.prefix ?? "";
    const suffix = item.suffix ?? "";
    return `${prefix}${n}${suffix}`;
  }, [val, decimals, item.prefix, item.suffix]);

  return (
    <div className="flex flex-col items-center max-w-[220px]">
      <span className={`text-5xl font-bold ${accentClass}`}>{shown}</span>
      <span className={`text-lg font-medium ${textClass} text-center`}>{item.label}</span>
    </div>
  );
};

const StatsComponent: React.FC = () => {
  const config: Config = useConfig();

  const cfg: StatsSectionConfig = {
    sectionId: "stats",
    backgroundImage: undefined,
    textColorClass: "text-gray-700",
    accentColorClass: "text-orange-500",
    items: [
      // Fallback vacío para no romper si aún no cargó config
    ],
    // override con JSON
    ...(config?.home?.stats ?? {}),
  };

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (inView) setVisible(true);
  }, [inView]);

  const bgStyle = cfg.backgroundImage
    ? { backgroundImage: `url('${cfg.backgroundImage}')` }
    : undefined;

  return (
    <section
      id={cfg.sectionId ?? "stats"}
      ref={ref}
      className="py-[5rem] border-t border-b px-[2rem] text-center bg-white flex flex-wrap justify-center items-center gap-8"
      style={bgStyle}
    >
      {(cfg.items ?? []).map((item: StatItem, idx: number) => (
        <StatCard
          key={`${item.label}-${idx}`}
          item={item}
          visible={visible}
          accentClass={cfg.accentColorClass ?? "text-orange-500"}
          textClass={cfg.textColorClass ?? "text-gray-700"}
        />
      ))}
    </section>
  );
};

export default StatsComponent;
