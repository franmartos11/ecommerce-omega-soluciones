// src/app/ConfigProvider/ConfigProvider.tsx
"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Config } from "@/lib/config.types"; // 👈 usa SIEMPRE el tipo único

// Context con el shape del Config
const ConfigContext = createContext<Config | null>(null);

// Provider: guarda el config (memoizado) y lo expone al árbol
export function ConfigProvider({
  initialConfig,
  children,
}: {
  initialConfig: Config;
  children: React.ReactNode;
}) {
  const value = useMemo(() => initialConfig, [initialConfig]);
  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

// Hook para consumir el config en cualquier componente cliente
export function useConfig(): Config {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within <ConfigProvider>");
  return ctx;
}

/**
 * (Opcional) Selector para evitar re-renders grandes:
 * Ejemplo de uso: const primary = useConfigSelector(c => c.Colores?.ColorPrimarioBG);
 */
// export function useConfigSelector<T>(selector: (cfg: Config) => T): T {
//   const cfg = useConfig();
//   return selector(cfg);
// }
