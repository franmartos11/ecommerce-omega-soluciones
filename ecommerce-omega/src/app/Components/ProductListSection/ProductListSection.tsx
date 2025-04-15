"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCardGrid, { Product } from "../ProductCardGrid/ProductCardGrid";
import CategoryFilter, { Category } from "../CategoryFilter/CategoryFilter";
import ProductFilterSidebar from "../ProductFilter/ProductFilter";

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

  // Obtener filtros desde la URL
  const filters = {
    category: searchParams.get("categoria") || null,
    colors: searchParams.getAll("color"),
    conditions: searchParams.getAll("condicion"),
    priceRange: [
      Number(searchParams.get("precio_min") || 0),
      Number(searchParams.get("precio_max") || 2000),
    ] as [number, number],
  };

  // Mock de categorías
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

  // Actualizar URL con filtros
  const updateFilterParam = (key: string, value: string | null | string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (Array.isArray(value)) {
      params.delete(key);
      value.forEach((v) => params.append(key, v));
    } else {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
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

      return matchesCategory && matchesColor && matchesCondition && matchesPrice;
    });

  const productosFiltrados = filtrarProductos(products);

  return (
    <section className="px-4 py-6">
      {/* Botón para mobile */}
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
            {/* Desktop */}
            <div className="hidden md:flex flex-col gap-4 sticky top-6">
              <CategoryFilter
                categories={categories}
                selected={filters.category}
                onSelect={(cat) => updateFilterParam("categoria", cat)}
              />
              <ProductFilterSidebar
                onFilter={(f) => {
                  updateFilterParam("precio_min", String(f.priceRange[0]));
                  updateFilterParam("precio_max", String(f.priceRange[1]));
                  updateFilterParam("color", f.colors);
                  updateFilterParam("condicion", f.conditions);
                }}
              />
            </div>

            {/* Mobile */}
            <div
              className={`md:hidden flex-col gap-4 transition-all duration-300 ease-in-out overflow-hidden ${
                mobileFiltersOpen ? "flex max-h-[2000px] opacity-100" : "max-h-0 opacity-0 hidden"
              }`}
            >
              <CategoryFilter
                categories={categories}
                selected={filters.category}
                onSelect={(cat) => updateFilterParam("categoria", cat)}
              />
              <ProductFilterSidebar
                onFilter={(f) => {
                  updateFilterParam("precio_min", String(f.priceRange[0]));
                  updateFilterParam("precio_max", String(f.priceRange[1]));
                  updateFilterParam("color", f.colors);
                  updateFilterParam("condicion", f.conditions);
                  setMobileFiltersOpen(false); // Cierra filtros en mobile
                }}
              />
            </div>
          </aside>
        )}

        <main className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          <ProductCardGrid products={productosFiltrados} />
        </main>
      </div>
    </section>
  );
};

export default ProductListSection;
