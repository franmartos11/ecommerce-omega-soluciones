// src/lib/config.types.ts
export interface OmegaSection {
  id: string;
  logo: string;
  title: string;
  description: string;
  main?: boolean; // opcional: cuál va al centro
}

export interface OmegaShowcaseConfig {
  rotateMs?: number;
  defaultActiveId?: string;
  backgroundImage?: string;
  sections: OmegaSection[];
}

export type BannerItem = {
  id: string;
  src: string;
  alt?: string;
  href?: string;
  orden?: number;
  visible?: boolean;
  vigencia?: { desde?: string; hasta?: string };
};

export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  // iconUrl?: string; // opcional
};

export type Badge = {
  label: string;
  color?: string;
  textColor?: string;
};

export type ProductoConfig = {
  id: string;
  imageUrl: string;
  /** usar el slug de Categorias ("paginas-web" | "apps" | "saas") */
  category: string;
  title: string;
  rating: number;
  brand: string;
  currentPrice: number;
  oldPrice: number;
  color: string;
  condition: string;
  badge?: Badge;
};

export type Config = {
  version: string;
  actualizadoEn?: string;
  sitio: {
    nombre: string;
    dominio: string;
    idioma: string;
    moneda?: string;
    timezone?: string;
  };

  Logo?: { src: string; alt: string };
  NumTelefonoSoporte?: string;

  Categorias: Categoria[];
  Filtros?: Record<string, unknown>;
  Banner?: { items: BannerItem[] };

  /** 🔹 OBLIGADO array */
  Productos: ProductoConfig[];

  Soporte?: Record<string, unknown>;
  Redes?: Record<string, string>;
  Contactanos?: Record<string, unknown>;
  SobreNosotros?: Record<string, unknown>;

  /**
   * 🎨 Colores del tema
   * - `vars` permite traer variables CSS directamente desde el JSON (p.ej. "--bgweb": "#000")
   * - Las claves legacy se mantienen por compatibilidad con JSONs anteriores.
   */
  Colores?: {
    /** Variables CSS crudas desde el JSON (opcional) */
    vars?: Record<`--${string}`, string>;

    /** Legacy (compatibilidad) */
    bgweb?: string;
    ColorPrimarioBG?: string;
    ColorSecundarioBG?: string;
    ColorTerciarioBG?: string;
    ColorPrimarioTEXT?: string;
    ColorSecundarioTEXT?: string;
    ColorTerciarioTEXT?: string;
  };
  SEO?: { titulo?: string; descripcion?: string; ogImage?: string };
  DefaultWeb?: Record<string, unknown>;
  home?: {
    omegaShowcase?: OmegaShowcaseConfig;
  };
};
