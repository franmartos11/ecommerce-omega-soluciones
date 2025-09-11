export type Categoria = { id: string; nombre: string; slug: string };

export type FiltroOption = { label: string; value: string };

export type FiltroMulti = {
tipo: "multi";
paramKey: string;
opciones: FiltroOption[];
display?: boolean;
};

export type FiltroSingle = {
tipo: "single";
paramKey: string;
opciones: FiltroOption[];
display?: boolean;
};

export type FiltroBoolean = {
tipo: "boolean";
paramKey: string;
trueValue?: string;
falseValue?: string;
display?: boolean;
};
export type FiltroRange = {
    tipo: "range";
    paramKey: string;
    min: number;
    max: number;
    step?: number;
    moneda?: string;
    display?: boolean;
    };

export type Filtros = {
precio?: FiltroRange;
color?: FiltroMulti;
condicion?: FiltroSingle;
[key: string]: FiltroRange | FiltroMulti | FiltroSingle | FiltroBoolean | undefined;
};

export type BannerItem = {
id: string;
src: string;
alt?: string;
href?: string;
orden?: number;
visible?: boolean;
vigencia?: { desde?: string; hasta?: string };
};

export type Config = {
version: string;
actualizadoEn: string;
sitio: {
nombre: string;
dominio: string;
idioma: string;
moneda: string;
timezone: string;
};
Logo: { src: string; alt?: string };
NumTelefonoSoporte?: string;
Categorias?: Categoria[];
Filtros?: Filtros;
Banner?: { items: BannerItem[] };
Productos?: Record<string, unknown>;
Soporte?: { tel?: string; email?: string; horario?: string; whatsapp?: string };
Redes?: Partial<Record<"Facebook" | "Instagram" | "Twitter" | "YouTube" | "LinkedIn", string>>;
Contactanos?: {
TextoPrincipal?: string;
Logo?: { src: string; alt?: string };
Ubicacion?: {
direccion?: string; ciudad?: string; provincia?: string; pais?: string;
lat?: number; lng?: number; mapsUrl?: string;
};
tel?: string; email?: string;
};
SobreNosotros?: { titulo?: string; contenido?: string; imagen?: string };
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
};
