import "server-only";
import { Config, BannerItem } from "./config.types";

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

export async function getConfig(): Promise<Config> {
const remote = process.env.CONFIG_URL;

if (remote) {
const res = await fetch(remote, { cache: "no-store" });
if (!res.ok) throw new Error(`CONFIG_URL fetch failed: ${res.status}`);
const cfg = (await res.json()) as Config;
return normalizeConfig(cfg);
}

// Fallback a archivo local en /public/config.json
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/config.json`, {
cache: "no-store",
}).catch(() => undefined);

// Si NEXT_PUBLIC_BASE_URL no está, usamos import dinámico (build-time)
if (!res || !res.ok) {
const cfg = (await import("../../public/ConfigJson/config.json", { assert: { type: "json" } }))
.default as Config;
return normalizeConfig(cfg);
}

const cfg = (await res.json()) as Config;
return normalizeConfig(cfg);
}
