"use client";
import React, { createContext, useContext, useMemo } from "react";

// en ConfigProvider/ConfigProvider.tsx
export type Config = {
    version: string;
    actualizadoEn?: string;
    sitio: { nombre: string; dominio: string; idioma: string; moneda?: string; timezone?: string };
    Logo?: { src: string; alt: string };
    NumTelefonoSoporte?: string;
    Categorias: { id: string; nombre: string; slug: string }[];
    Filtros?: unknown;
    Banner?: unknown;
    Productos: Array<{
      id: string;
      imageUrl: string;
      category: string; // slug
      title: string;
      rating: number;
      brand: string;
      currentPrice: number;
      oldPrice: number;
      color: string;
      condition: string;
      badge?: { label: string; color?: string; textColor?: string };
    }>;
    Soporte?: unknown;
    Redes?: Record<string, string>;
    Contactanos?: unknown;
    SobreNosotros?: unknown;
    Colores?: {
      bgweb?: string;
      ColorPrimarioBG?: string; ColorSecundarioBG?: string; ColorTerciarioBG?: string;
      ColorPrimarioTEXT?: string; ColorSecundarioTEXT?: string; ColorTerciarioTEXT?: string;
    };
    SEO?: { titulo?: string; descripcion?: string; ogImage?: string };
    DefaultWeb?: unknown;
  };
  

const ConfigContext = createContext<Config | null>(null);

export function ConfigProvider({ initialConfig, children }: { initialConfig: Config; children: React.ReactNode; }) {
    
// Memo para evitar re-renders
const value = useMemo(() => initialConfig, [initialConfig]);
return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
const ctx = useContext(ConfigContext);
if (!ctx) throw new Error("useConfig must be used within <ConfigProvider>");
return ctx;
}
