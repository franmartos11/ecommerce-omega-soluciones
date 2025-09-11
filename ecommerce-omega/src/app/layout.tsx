import "./globals.css";
import { Suspense } from "react";
import ThemeProvider from "./ThemeProvider/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import { getConfig } from "@/lib/config.server";
import { Metadata } from "next";
import { ConfigProvider } from "./ConfigProvider/ConfigProvider";
export const dynamic = "force-dynamic";
export const revalidate = 0;


export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getConfig();
  return {
    title: cfg.SEO?.titulo ?? cfg.sitio.nombre,
    description: cfg.SEO?.descripcion,
    openGraph: {
      title: cfg.SEO?.titulo ?? cfg.sitio.nombre,
      description: cfg.SEO?.descripcion,
      images: cfg.SEO?.ogImage ? [cfg.SEO.ogImage] : undefined,
      locale: cfg.sitio.idioma,
      siteName: cfg.sitio.nombre,
    },
    metadataBase: new URL(cfg.sitio.dominio),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cfg = await getConfig();
  return (
    <html lang={cfg.sitio.idioma}>
      <head />
      <body>
        {/* Inyección de variables CSS para colores */}
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
