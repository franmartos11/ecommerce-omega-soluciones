"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCardGrid, { Product } from "../ProductCardGrid/ProductCardGrid";
import CategoryFilter, { Category } from "../CategoryFilter/CategoryFilter";
import ProductFilterSidebar from "../ProductFilter/ProductFilter";
import CarouselBanner from "../CarrouselImgs/CarrouselBanner";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";


/* Tipos auxiliares (coinciden con tu config.json) */
type ConfigCategoria = {
  id: string;
  nombre: string;
  slug: string;
  // NOTA: tu JSON no trae iconUrl; si algún día lo agregás, podés extender acá con:
  // iconUrl?: string;
};

/* Type guards sin `any` */
function isCategoriasArray(v: unknown): v is ConfigCategoria[] {
  return Array.isArray(v) && v.every(
    (x) =>
      typeof x === "object" &&
      x !== null &&
      "id" in x &&
      "nombre" in x &&
      "slug" in x
  );
}

/* Helpers label <-> slug */
function nombreFromSlug(slug: string | null, cats: ConfigCategoria[]): string | null {
  if (!slug) return null;
  const f = cats.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  return f?.nombre ?? null;
}

function slugFromNombre(nombre: string | null, cats: ConfigCategoria[]): string | null {
  if (!nombre) return null;
  const f = cats.find((c) => c.nombre === nombre);
  return f?.slug ?? null;
}

interface ProductListSectionProps {
  title?: string;
  products: Product[];
  showFilter?: boolean;
}

const ProductListSection: React.FC<ProductListSectionProps> = ({
  products,
  showFilter = true,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const config = useConfig();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Leemos categorías del config con guard (sin `any`)
  const categorias: ConfigCategoria[] = useMemo(() => {
    return isCategoriasArray(config?.Categorias) ? config!.Categorias : [];
  }, [config?.Categorias]);

  // Derivamos categorías para el CategoryFilter (usa {label, iconUrl})
  const categories: Category[] = useMemo(() => {
    return categorias.map((c) => ({
      label: c.nombre,
      // ✅ Como tu JSON no trae iconUrl, generamos un fallback por slug:
      iconUrl: `/icons/${c.slug}.svg`,
    }));
  }, [categorias]);

  // Filtros desde la URL (slug como fuente de verdad)
  const filters = {
    categorySlug: searchParams.get("categoria") || null,
    colors: searchParams.getAll("color"),
    conditions: searchParams.getAll("condicion"),
    priceRange: [
      Number(searchParams.get("precio_min")) || 0,
      Number(searchParams.get("precio_max")) || 20000,
    ] as [number, number],
    search: (searchParams.get("busqueda") || "").toLowerCase(),
  };

  // Label seleccionado para CategoryFilter (CategoryFilter.selected espera label)
  const selectedLabel = useMemo(
    () => nombreFromSlug(filters.categorySlug, categorias),
    [filters.categorySlug, categorias]
  );

  // Push de filtros a la URL (guardamos slug)
  const applyAllFilters = (f: {
    priceRange: number[];
    colors: string[];
    conditions: string[];
    categorySlug?: string | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("precio_min");
    params.delete("precio_max");
    params.delete("color");
    params.delete("condicion");
    params.delete("categoria");

    params.set("precio_min", String(f.priceRange[0]));
    params.set("precio_max", String(f.priceRange[1]));
    f.colors.forEach((c) => params.append("color", c));
    f.conditions.forEach((c) => params.append("condicion", c));
    if (f.categorySlug) params.set("categoria", f.categorySlug);

    router.push(`?${params.toString()}`);
  };

  // Filtrado local (asume que Product.category guarda el slug)
  const productosFiltrados = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        !filters.categorySlug ||
        (p.category?.toLowerCase() ?? "") === filters.categorySlug.toLowerCase();

      const matchesColor =
        filters.colors.length === 0 || filters.colors.includes(p.color || "");

      const matchesCondition =
        filters.conditions.length === 0 ||
        filters.conditions.includes(p.condition || "");

      const matchesPrice =
        p.currentPrice >= filters.priceRange[0] &&
        p.currentPrice <= filters.priceRange[1];

      const matchesSearch =
        !filters.search || p.title.toLowerCase().includes(filters.search);

      return (
        matchesCategory &&
        matchesColor &&
        matchesCondition &&
        matchesPrice &&
        matchesSearch
      );
    });
  }, [products, filters]);

  return (
    <section className="">
      {/* 📱 Toggle filtros mobile */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full shadow-2xl shadow-gray-400 border rounded-lg py-2 px-4 text-sm font-medium text-white border-border2 bg-bg1"
        >
          {mobileFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        {showFilter && (
          <aside className="w-full md:w-[260px] shrink-0">
            {/* 🖥 Desktop */}
            <div className="hidden md:flex flex-col gap-4 sticky top-6">
              <CategoryFilter
                categories={categories}
                selected={selectedLabel}
                onSelect={(labelOrNull) =>
                  applyAllFilters({
                    priceRange: filters.priceRange,
                    colors: filters.colors,
                    conditions: filters.conditions,
                    categorySlug: slugFromNombre(labelOrNull, categorias),
                  })
                }
              />

              <ProductFilterSidebar
                onFilter={(f) => {
                  applyAllFilters({
                    ...f,
                    categorySlug: filters.categorySlug,
                  });
                }}
              />
            </div>

            {/* 📱 Mobile */}
            <div
              className={`md:hidden flex-col gap-4 transition-all duration-300 ease-in-out overflow-hidden ${
                mobileFiltersOpen
                  ? "flex align-middle justify-center max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0 hidden"
              }`}
            >
              <CategoryFilter
                categories={categories}
                selected={selectedLabel}
                onSelect={(labelOrNull) =>
                  applyAllFilters({
                    priceRange: filters.priceRange,
                    colors: filters.colors,
                    conditions: filters.conditions,
                    categorySlug: slugFromNombre(labelOrNull, categorias),
                  })
                }
              />

              <ProductFilterSidebar
                onFilter={(f) => {
                  applyAllFilters({
                    ...f,
                    categorySlug: filters.categorySlug,
                  });
                  setMobileFiltersOpen(false);
                }}
              />
            </div>
          </aside>
        )}

        <main className="flex-1 min-w-0">
          <CarouselBanner />
          <ProductCardGrid products={productosFiltrados} />
        </main>
      </div>
    </section>
  );
};

export default ProductListSection;
