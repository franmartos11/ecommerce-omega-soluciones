import "server-only";
import path from "node:path";
import fs from "node:fs/promises";
import { Config, BannerItem } from "./config.types";

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
  Productos: {},
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

// Ruta local del JSON dentro de /public. Ajustá si cambiás la carpeta.
const LOCAL_CONFIG_PATHS = [
  path.join(process.cwd(), "public", "ConfigJson", "config.json"), // tu ruta actual
  path.join(process.cwd(), "public", "config.json"), // fallback si lo movés a raíz de public
];

function nowISODateOnly() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
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

  // Banner: filtrar visibles, vigencia, ordenar y deduplicar
  if (cfg.Banner?.items?.length) {
    const cleaned = cfg.Banner.items
      .filter((b) => b.visible !== false)
      .filter(withinVigencia)
      .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
    cfg.Banner.items = dedupe(cleaned);
  }

  return cfg;
}
async function readLocalConfig(): Promise<Config | null> {
  for (const p of LOCAL_CONFIG_PATHS) {
    try {
      const raw = await fs.readFile(p, "utf8");
      const json = JSON.parse(raw) as Config;
      return normalizeConfig(json);
    } catch {
      /* noop */
    }
  }
  return null;
}

export async function getConfig(): Promise<Config> {
  // 1) Remoto por ENV (útil en producción si querés editar sin redeploy)
  const remote = process.env.CONFIG_URL;
  if (remote) {
    try {
      const res = await fetch(remote, { cache: "no-store" });
      if (res.ok) {
        const cfg = (await res.json()) as Config;
        return normalizeConfig(cfg);
      }
    } catch {
      // ignore y seguimos a local
    }
  }

  // 2) Local: leer desde /public usando fs (no intentes importar desde /public; no es parte del bundle)
  const local = await readLocalConfig();
  if (local) return local;

  // 3) Último recurso: intentar fetch a la ruta pública conocida (requiere URL absoluta en server)
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (base) {
    try {
      const res = await fetch(new URL("/ConfigJson/config.json", base), {
        cache: "no-store",
      });
      if (res.ok) {
        const cfg = (await res.json()) as Config;
        return normalizeConfig(cfg);
      }
    } catch {
      // ignore
    }
  }

  // 4) Fallback definitivo para no romper prerender
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[config] No se encontró config.json. Usando DEFAULT_CONFIG para evitar fallas de prerender."
    );
  }
  return DEFAULT_CONFIG;
}
