"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCardGrid, { Product } from "../ProductCardGrid/ProductCardGrid";
import CategoryFilter, { Category } from "../CategoryFilter/CategoryFilter";
import ProductFilterSidebar from "../ProductFilter/ProductFilter";
import CarouselBanner from "../CarrouselImgs/CarrouselBanner";

interface ProductListSectionProps {
  title?: string;
  products: Product[];
  showFilter?: boolean;
}

const ProductListSection: React.FC<ProductListSectionProps> = ({
  title = "Productos",
  products,
  showFilter = true,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = {
    category: searchParams.get("categoria") || null,
    colors: searchParams.getAll("color"),
    conditions: searchParams.getAll("condicion"),
    priceRange: [
      Number(searchParams.get("precio_min")) || 0,
      Number(searchParams.get("precio_max")) || 20000,
    ] as [number, number],
    search: searchParams.get("busqueda")?.toLowerCase() || "",
  };

  useEffect(() => {
    console.log("🔎 Filtros desde URL:", filters);
  }, [searchParams]);

  useEffect(() => {
    const mockCategories = [
      { label: "Tecnologia", iconUrl: "/icons/tech.svg" },
      { label: "Herramientas", iconUrl: "/icons/tools.svg" },
      { label: "Electrodomésticos", iconUrl: "/icons/home.svg" },
      { label: "Construcción", iconUrl: "/icons/construction.svg" },
      { label: "Productos Químicos", iconUrl: "/icons/chemical.svg" },
    ];
    const timeout = setTimeout(() => setCategories(mockCategories), 500);
    return () => clearTimeout(timeout);
  }, []);

  // ✅ Ahora incluye "category"
  const applyAllFilters = (f: {
    priceRange: number[];
    colors: string[];
    conditions: string[];
    category?: string | null;
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
    if (f.category) {
      params.set("categoria", f.category);
    }

    router.push(`?${params.toString()}`);
  };

  const filtrarProductos = (productos: Product[]) =>
    productos.filter((p) => {
      const matchesCategory =
        !filters.category || p.category?.toLowerCase() === filters.category.toLowerCase();
      const matchesColor =
        filters.colors.length === 0 || filters.colors.includes(p.color || "");
      const matchesCondition =
        filters.conditions.length === 0 || filters.conditions.includes(p.condition || "");
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

  const productosFiltrados = filtrarProductos(products);

  return (
    <section className="px-4 py-6">
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full border rounded-lg py-2 px-4 text-sm font-medium text-green-600 border-green-300 bg-green-50"
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
                selected={filters.category}
                onSelect={(cat) =>
                  applyAllFilters({
                    priceRange: filters.priceRange,
                    colors: filters.colors,
                    conditions: filters.conditions,
                    category: cat, // ✅ pasar categoría seleccionada
                  })
                }
              />
              <ProductFilterSidebar
                onFilter={(f) => {
                  console.log("📤 Filtros aplicados desde sidebar:", f);
                  applyAllFilters({
                    ...f,
                    category: filters.category, // ✅ mantener categoría actual
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
                selected={filters.category}
                onSelect={(cat) =>
                  applyAllFilters({
                    priceRange: filters.priceRange,
                    colors: filters.colors,
                    conditions: filters.conditions,
                    category: cat,
                  })
                }
              />
              <ProductFilterSidebar
                onFilter={(f) => {
                  console.log("📤 Filtros aplicados desde sidebar (mobile):", f);
                  applyAllFilters({
                    ...f,
                    category: filters.category,
                  });
                  setMobileFiltersOpen(false);
                }}
              />
            </div>
          </aside>
        )}

        <main className="flex-1 min-w-0">
          <CarouselBanner />
          <h2 className="text-2xl font-semibold mb-4 text-black">{title}</h2>
          <ProductCardGrid products={productosFiltrados} />
        </main>
      </div>
    </section>
  );
};

export default ProductListSection;
