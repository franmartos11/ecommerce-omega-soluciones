// src/app/layout.tsx
import "./globals.css";
import { Suspense } from "react";
import ThemeProvider from "./ThemeProvider/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import { getConfig } from "@/lib/config.server";
import { Metadata } from "next";
import { Config, ConfigProvider} from "./ConfigProvider/ConfigProvider"; // 👈 importá el tipo correcto

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
  // getConfig debe devolver el objeto con la forma de Config
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
  // Traemos el config y lo tratamos como `Config` (la forma que espera el provider)
  const raw = (await getConfig()) as unknown as Config;

  // Congelamos para evitar mutaciones accidentales
  const cfg: Config = Object.freeze(raw);

  const lang = cfg.sitio?.idioma ?? "es";

  return (
    <html lang={lang} suppressHydrationWarning>
      <head />
      <body>
        {/* Variables de tema desde config */}
        <style suppressHydrationWarning>{`
          :root{
            --bgweb: ${cfg.Colores?.bgweb ?? "#0B1220"};
            --color-primary-bg: ${cfg.Colores?.ColorPrimarioBG ?? "#04B0DB"};
            --color-secondary-bg: ${cfg.Colores?.ColorSecundarioBG ?? "#0EA5E9"};
            --color-tertiary-bg: ${cfg.Colores?.ColorTerciarioBG ?? "#111827"};
            --color-primary-text: ${cfg.Colores?.ColorPrimarioTEXT ?? "#FFFFFF"};
            --color-secondary-text: ${cfg.Colores?.ColorSecundarioTEXT ?? "#E5E7EB"};
            --color-tertiary-text: ${cfg.Colores?.ColorTerciarioTEXT ?? "#9CA3AF"};
          }
          body{ background: var(--bgweb); color: var(--color-primary-text); }
        `}</style>

        <AuthProvider>
          <ThemeProvider>
            {/* ✅ Pasamos exactamente `Config` */}
            <ConfigProvider initialConfig={cfg}>
              <Suspense fallback={<div className="p-6">Cargando...</div>}>
                {children}
              </Suspense>
            </ConfigProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
