"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCardGrid, { Product } from "../ProductCardGrid/ProductCardGrid";
import CategoryFilter, { Category } from "../CategoryFilter/CategoryFilter";
import ProductFilterSidebar from "../ProductFilter/ProductFilter";
import CarouselBanner from "../CarrouselImgs/CarrouselBanner";
import { useConfig } from "@/app/ConfigProvider/ConfigProvider";


interface ProductListSectionProps {
  title?: string;
  products: Product[];
  showFilter?: boolean;
}

// Helpers nombre <-> slug usando las categorías del config
const nombreFromSlug = (
  slug: string | null,
  cats?: { id: string; nombre: string; slug: string; iconUrl?: string }[]
): string | null => {
  if (!slug || !cats?.length) return null;
  const found = cats.find((c) => c.slug?.toLowerCase() === slug.toLowerCase());
  return found?.nombre ?? null;
};

const slugFromNombre = (
  nombre: string | null,
  cats?: { id: string; nombre: string; slug: string; iconUrl?: string }[]
): string | null => {
  if (!nombre || !cats?.length) return null;
  const found = cats.find((c) => c.nombre === nombre);
  return found?.slug ?? null;
};

const ProductListSection: React.FC<ProductListSectionProps> = ({
  products,
  showFilter = true,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const config = useConfig();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Leemos el slug de la URL (fuente de verdad para filtros)
  const categorySlug = searchParams.get("categoria") || null;

  const filters = {
    categorySlug, // slug en URL
    colors: searchParams.getAll("color"),
    conditions: searchParams.getAll("condicion"),
    priceRange: [
      Number(searchParams.get("precio_min")) || 0,
      Number(searchParams.get("precio_max")) || 20000,
    ] as [number, number],
    search: searchParams.get("busqueda")?.toLowerCase() || "",
  };

  // Derivamos CategoryFilter.categories desde el ConfigProvider
  const categories: Category[] = useMemo(() => {
    const cats = config?.Categorias ?? [];
    return cats.map((c) => ({
      label: c.nombre, // CategoryFilter usa label
      iconUrl: c.iconUrl ?? `/icons/${c.slug}.svg`, // fallback si no viene iconUrl en el config
    }));
  }, [config?.Categorias]);

  // Para el CategoryFilter.selected (espera `label`), convertimos slug -> nombre
  const selectedLabel = useMemo(
    () => nombreFromSlug(filters.categorySlug, config?.Categorias),
    [filters.categorySlug, config?.Categorias]
  );

  // Push de todos los filtros a la URL (usamos slug para categoría)
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

  // Filtrado: asumimos que p.category guarda el slug de la categoría del producto
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
                selected={selectedLabel} // CategoryFilter espera label (nombre)
                onSelect={(labelOrNull) =>
                  applyAllFilters({
                    priceRange: filters.priceRange,
                    colors: filters.colors,
                    conditions: filters.conditions,
                    // convertimos el label (nombre) a slug para la URL
                    categorySlug: slugFromNombre(labelOrNull, config?.Categorias),
                  })
                }
              />

              <ProductFilterSidebar
                onFilter={(f) => {
                  applyAllFilters({
                    ...f,
                    categorySlug: filters.categorySlug, // mantenemos la categoría actual (slug)
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
                    categorySlug: slugFromNombre(labelOrNull, config?.Categorias),
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
