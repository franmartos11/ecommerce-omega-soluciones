// src/lib/config.types.ts
export interface OmegaSection {
  id: string;
  logo: string;
  title: string;
  description: string;
  main?: boolean;
}
export interface ContactWhatsappCfg {
  enabled: boolean;
  internationalPrefix?: string;
  defaultText?: string;
}

export interface ContactEntry {
  title: string;
  email?: string;
  phone?: string;
  whatsapp?: ContactWhatsappCfg;
}

export interface ContactLogo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  rounded?: boolean;
}

export interface ContactMap {
  iframeSrc: string;
  height?: number;
}

export interface ContactSectionConfig {
  sectionId?: string;
  backgroundImage?: string;
  heading?: string;
  subtitle?: string;
  logo?: ContactLogo;
  contacts: ContactEntry[];
  map?: ContactMap;
}

export interface MisionVisionBlock {
  title: string;
  text?: string;
}

export interface MisionVisionConfig {
  sectionId?: string;
  backgroundImage?: string;
  heading?: string;
  introTitle?: string;
  introSubtitle?: string;
  mission: MisionVisionBlock;
  vision: MisionVisionBlock;
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
    misionVision?: MisionVisionConfig;
    contact?: ContactSectionConfig;
  };
};
