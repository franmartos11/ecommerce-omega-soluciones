// src/app/layout.tsx
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { getConfig } from "@/lib/config.server";
import { Metadata } from "next";
import type { Config } from "@/lib/config.types";                 // ✅ tipo desde lib
import { ConfigProvider } from "./ConfigProvider/ConfigProvider"; // ✅ solo el provider

export const dynamic = "force-dynamic";
export const revalidate = 0;

function safeMetadataBase(urlLike?: string): URL | undefined {
  if (!urlLike) return undefined;
  try {
    return new URL(urlLike);
  } catch {
    return undefined;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cfg = (await getConfig()) as unknown as Config;

  const titulo =
    (cfg.SEO?.titulo?.trim()?.length ? cfg.SEO?.titulo : undefined) ??
    cfg.sitio?.nombre ??
    "Sitio";

  const descripcion =
    cfg.SEO?.descripcion?.trim()?.length ? cfg.SEO.descripcion : undefined;

  const ogImage = cfg.SEO?.ogImage ? [cfg.SEO.ogImage] : undefined;

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      images: ogImage,
      locale: cfg.sitio?.idioma ?? "es",
      siteName: cfg.sitio?.nombre ?? titulo,
    },
    metadataBase: safeMetadataBase(cfg.sitio?.dominio),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Traemos el config y lo tratamos como `Config`
  const raw = (await getConfig()) as unknown as Config;

  // Congelamos para evitar mutaciones accidentales
  const cfg: Config = Object.freeze(raw);

  const lang = cfg.sitio?.idioma ?? "es";

  // Tomamos las variables desde el JSON (Colores.vars) y aplicamos defaults
  const colorVars = {
    ...(cfg.Colores?.vars ?? {}),
    "--bgweb": cfg.Colores?.vars?.["--bgweb"] ?? "#000000",
    "--color-primary-bg": cfg.Colores?.vars?.["--color-primary-bg"] ?? "#04B0DB",
    "--color-secondary-bg": cfg.Colores?.vars?.["--color-secondary-bg"] ?? "#0EA5E9",
    "--color-tertiary-bg": cfg.Colores?.vars?.["--color-tertiary-bg"] ?? "#111827",
    "--color-primary-text": cfg.Colores?.vars?.["--color-primary-text"] ?? "#FFFFFF",
    "--color-secondary-text": cfg.Colores?.vars?.["--color-secondary-text"] ?? "#374151",
    "--color-tertiary-text": cfg.Colores?.vars?.["--color-tertiary-text"] ?? "#9CA3AF",
  };

  // Sanidad básica: aceptar solo keys que parezcan CSS custom properties
  const cssVars = Object.entries(colorVars)
    .filter(([k]) => /^--[a-z0-9-]+$/i.test(k))
    .map(([k, v]) => `${k}: ${v};`)
    .join("\n");

  return (
    <html lang={lang} suppressHydrationWarning>
      <head />
      <body>
        {/* Variables de tema desde config (solo Colores.vars + defaults) */}
        <style suppressHydrationWarning>{`
          :root{
            ${cssVars}
          }
          body{ background: var(--bgweb); color: var(--color-primary-text); }
        `}</style>

        <AuthProvider>
          {/* Pasamos exactamente `Config` */}
          <ConfigProvider initialConfig={cfg}>
            <Suspense fallback={<div className="p-6">Cargando...</div>}>
              {children}
            </Suspense>
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
