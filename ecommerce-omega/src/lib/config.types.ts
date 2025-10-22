// src/lib/config.types.ts
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
  // iconUrl?: string; // opcional si querés
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
  Colores?: {
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
};
