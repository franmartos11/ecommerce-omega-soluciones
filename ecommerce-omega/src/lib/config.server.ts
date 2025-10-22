// src/lib/config.server.ts
import "server-only";
import { Config, BannerItem } from "./config.types";
// ⬇️ IMPORT ESTÁTICO del JSON dentro de src/
import rawConfig from "@/ConfigJson/config.json"; // <- poné el JSON en src/config/config.json

const DEFAULT_CONFIG: Config = {
  version: "0.0.0",
  actualizadoEn: new Date().toISOString(),
  sitio: {
    nombre: "Omega Soluciones",
    dominio: "http://localhost:3000",
    idioma: "es-AR",
    moneda: "ARS",
    timezone: "America/Argentina/Cordoba",
  },
  Logo: { src: "/logo.png", alt: "Omega Soluciones" },
  Categorias: [],
  Filtros: {},
  Banner: { items: [] },
  Productos: [],
  Soporte: {},
  Redes: {},
  Contactanos: {},
  SobreNosotros: {},
  Colores: {
    bgweb: "#0B1220",
    ColorPrimarioBG: "#04B0DB",
    ColorSecundarioBG: "#0EA5E9",
    ColorTerciarioBG: "#111827",
    ColorPrimarioTEXT: "#FFFFFF",
    ColorSecundarioTEXT: "#E5E7EB",
    ColorTerciarioTEXT: "#9CA3AF",
  },
  SEO: { titulo: "Omega Soluciones", descripcion: "", ogImage: undefined },
};

function nowISODateOnly() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function withinVigencia(item: BannerItem): boolean {
  if (!item.vigencia) return true;
  const today = nowISODateOnly();
  const desde = item.vigencia.desde ?? "0000-01-01";
  const hasta = item.vigencia.hasta ?? "9999-12-31";
  return today >= desde && today <= hasta;
}

function dedupe<T extends { id?: string; src?: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const el of arr) {
    const key = `${el.id ?? ""}|${el.src ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(el);
  }
  return out;
}

export function normalizeConfig(input: Config): Config {
  const cfg = structuredClone(input);

  // Banner: visibles, vigencia, orden y dedupe
  if (cfg.Banner?.items?.length) {
    const cleaned = cfg.Banner.items
      .filter((b) => b.visible !== false)
      .filter(withinVigencia)
      .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
    cfg.Banner.items = dedupe(cleaned);
  }

  return cfg;
}

/**
 * Devuelve el config. Prioriza:
 * 1) CONFIG_URL (remote override opcional)
 * 2) Import estático empaquetado en build (src/config/config.json)
 * 3) DEFAULT_CONFIG (fallback)
 */
export async function getConfig(): Promise<Config> {
  // 1) Remoto por ENV (si querés sobreescribir sin redeploy)
  const remote = process.env.CONFIG_URL;
  if (remote) {
    try {
      const res = await fetch(remote, { cache: "no-store" });
      if (res.ok) {
        const cfg = (await res.json()) as Config;
        return normalizeConfig(cfg);
      }
      console.warn(`[config] CONFIG_URL respondió ${res.status}`);
    } catch (e) {
      console.warn("[config] Error trayendo CONFIG_URL:", e);
    }
  }

  // 2) Import estático (el más robusto en Vercel)
  try {
    const cfg = rawConfig as Config;
    return normalizeConfig(cfg);
  } catch (e) {
    console.warn("[config] Error usando import estático, usando DEFAULT_CONFIG:", e);
  }

  // 3) Fallback
  return DEFAULT_CONFIG;
}
