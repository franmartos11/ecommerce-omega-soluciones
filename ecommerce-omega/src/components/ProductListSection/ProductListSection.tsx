"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCardGrid, { Product } from "../ProductCardGrid/ProductCardGrid";
import CategoryFilter, { Category } from "../CategoryFilter/CategoryFilter";
import ProductFilterSidebar from "../ProductFilter/ProductFilter";
import CarouselBanner from "../CarrouselImgs/CarrouselBanner";
import Fuse from "fuse.js";


type DbCategory = {
  id: string;
  nombre: string;
  slug: string;
  icon_url?: string;
};



/* Helpers label <-> slug */
function nombreFromSlug(slug: string | null, cats: DbCategory[]): string | null {
  if (!slug) return null;
  const f = cats.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  return f?.nombre ?? null;
}

function slugFromNombre(nombre: string | null, cats: DbCategory[]): string | null {
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

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [dbCategorias, setDbCategorias] = useState<DbCategory[]>([]);

  // Leemos categorías de la base de datos
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setDbCategorias(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }
    fetchCategories();
  }, []);

  // Derivamos categorías para el CategoryFilter (usa {label, iconUrl})
  const categories: Category[] = useMemo(() => {
    return dbCategorias.map((c) => ({
      label: c.nombre,
      iconUrl: c.icon_url || `/icons/${c.slug}.svg`, // Prefiere DB, fallback a slug estático
    }));
  }, [dbCategorias]);

  // Filtros desde la URL (slug como fuente de verdad)
  const filters = useMemo(() => ({
    categorySlug: searchParams.get("categoria") || null,
    colors: searchParams.getAll("color"),
    brands: searchParams.getAll("marca"),
    tags: searchParams.getAll("tag"),
    inStock: searchParams.get("stock") === "true",
    priceRange: [
      Number(searchParams.get("precio_min")) || 0,
      Number(searchParams.get("precio_max")) || 20000,
    ] as [number, number],
    search: (searchParams.get("busqueda") || "").toLowerCase(),
  }), [searchParams]);

  // Label seleccionado para CategoryFilter (CategoryFilter.selected espera label)
  const selectedLabel = useMemo(
    () => nombreFromSlug(filters.categorySlug, dbCategorias),
    [filters.categorySlug, dbCategorias]
  );

  // Push de filtros a la URL (guardamos slug)
  const applyAllFilters = (f: {
    priceRange: number[];
    colors: string[];
    brands: string[];
    tags: string[];
    inStock: boolean;
    categorySlug?: string | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("precio_min");
    params.delete("precio_max");
    params.delete("color");
    params.delete("marca");
    params.delete("tag");
    params.delete("stock");
    params.delete("categoria");

    params.set("precio_min", String(f.priceRange[0]));
    params.set("precio_max", String(f.priceRange[1]));
    f.colors.forEach((c) => params.append("color", c));
    f.brands.forEach((c) => params.append("marca", c));
    f.tags.forEach((c) => params.append("tag", c));
    if (f.inStock) params.set("stock", "true");
    if (f.categorySlug) params.set("categoria", f.categorySlug);

    router.push(`?${params.toString()}`);
  };

  // Filtrado local (asume que Product.category guarda el slug)
  const productosFiltrados = useMemo(() => {
    // 1. Filtros exactos y de rangos
    let filtered = products.filter((p) => {
      const matchesCategory =
        !filters.categorySlug ||
        (p.category?.toLowerCase() ?? "") === filters.categorySlug.toLowerCase();

      const matchesColor =
        filters.colors.length === 0 || filters.colors.includes(p.color || "");

      const matchesBrand =
        filters.brands.length === 0 || filters.brands.includes(p.mfg || "");

      const matchesTag =
        filters.tags.length === 0 || filters.tags.some(tag => (p.tags || []).includes(tag));

      const matchesStock = 
        !filters.inStock || p.stock > 0;

      const matchesPrice =
        p.currentPrice >= filters.priceRange[0] &&
        p.currentPrice <= filters.priceRange[1];

      return (
        matchesCategory &&
        matchesColor &&
        matchesBrand &&
        matchesTag &&
        matchesStock &&
        matchesPrice
      );
    });

    // 2. Búsqueda Difusa (Fuzzy Search) sobre los resultados previos
    if (filters.search) {
      const fuse = new Fuse(filtered, {
        keys: [
          { name: "title", weight: 0.6 },
          { name: "mfg", weight: 0.2 },
          { name: "category", weight: 0.1 },
          { name: "tags", weight: 0.1 }
        ],
        threshold: 0.35, // Permite errores de tipeo moderados
        ignoreLocation: true, // No importa si la palabra está al final del título
      });
      // fuse.search devuelve { item, refIndex }
      filtered = fuse.search(filters.search).map(result => result.item);
    }

    return filtered;
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
                    brands: filters.brands,
                    tags: filters.tags,
                    inStock: filters.inStock,
                    categorySlug: slugFromNombre(labelOrNull, dbCategorias),
                  })
                }
              />

              <ProductFilterSidebar
                products={products}
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
                    brands: filters.brands,
                    tags: filters.tags,
                    inStock: filters.inStock,
                    categorySlug: slugFromNombre(labelOrNull, dbCategorias),
                  })
                }
              />

              <ProductFilterSidebar
                products={products}
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
