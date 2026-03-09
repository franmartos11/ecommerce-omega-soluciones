"use client";

import { FC, useState, useMemo } from "react";
import { Range, getTrackBackground } from "react-range";
import { Funnel } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Product } from "../ProductCardGrid/ProductCardGrid";

// Tipado para los filtros devueltos
interface Filters {
  priceRange: number[];
  colors: string[];
  brands: string[];
  tags: string[];
  inStock: boolean;
}

interface FilterSidebarProps {
  products: Product[];
  onFilter: (filters: Filters) => void;
}

const STEP = 10;
const MIN = 0;
const MAX = 20000;

const ProductFilterSidebar: FC<FilterSidebarProps> = ({ products, onFilter }) => {
  const searchParams = useSearchParams();
  
  // States holding current selection
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("precio_min")) || MIN,
    Number(searchParams.get("precio_max")) || MAX,
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>(searchParams.getAll("color") || []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(searchParams.getAll("marca") || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.getAll("tag") || []);
  const [inStockOnly, setInStockOnly] = useState<boolean>(searchParams.get("stock") === "true");

  // Dynamically compute available counts exactly from products list
  const filterData = useMemo(() => {
    const brandsMap: Record<string, number> = {};
    const colorsMap: Record<string, number> = {};
    const tagsMap: Record<string, number> = {};

    products.forEach((p) => {
      // Brands
      if (p.mfg && p.mfg !== "N/A" && p.mfg.trim() !== "") {
        brandsMap[p.mfg] = (brandsMap[p.mfg] || 0) + 1;
      }
      
      // Colors
      if (p.color && p.color !== "N/A" && p.color.trim() !== "") {
        colorsMap[p.color] = (colorsMap[p.color] || 0) + 1;
      }

      // Tags
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((tag) => {
           if (tag !== p.category && tag !== "General" && tag.trim() !== "") { // Hide generic category/tag duplicates
             tagsMap[tag] = (tagsMap[tag] || 0) + 1;
           }
        });
      }
    });

    return {
      brands: Object.entries(brandsMap).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count),
      colors: Object.entries(colorsMap).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count),
      tags: Object.entries(tagsMap).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count),
    };
  }, [products]);

  const toggle = (
    list: string[],
    setList: (val: string[]) => void,
    item: string
  ) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const applyFilters = () => {
    onFilter({
      priceRange,
      colors: selectedColors,
      brands: selectedBrands,
      tags: selectedTags,
      inStock: inStockOnly,
    });
  };

  return (
    <div className="w-full max-w-xs rounded-xl border border-gray-200 p-4 shadow-sm bg-white">
      {/* IN STOCK */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
           <p className="text-sm font-semibold" style={{color:"var(--color-primary-text)"}}>Disponibilidad</p>
           <p className="text-xs mt-0.5" style={{color:"var(--color-secondary-text)"}}>Mostrar solo en stock</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* PRICE RANGE */}
      <h2 className="text-sm font-semibold mb-4" style={{ color:"var(--color-primary-text)"}}>Filtro Precio</h2>
      <Range
        values={priceRange}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={setPriceRange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 w-full rounded bg-bg1 mb-4"
            style={{
              background: getTrackBackground({
                values: priceRange,
                colors: ["bg1", "bg2", "bg1"],
                min: MIN,
                max: MAX,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => {
          const { key, ...rest } = props;
          return (
            <div
              key={key}
              {...rest}
              className="h-4 w-4 rounded-full bg-bg1 shadow cursor-grab active:cursor-grabbing"
            />
          );
        }}
      />
      <div className="flex justify-between text-sm mb-6" style={{ color:"var(--color-secondary-text)"}}>
        <span>Desde: <span className="font-semibold" style={{color:"var(--color-primary-text)"}}>${priceRange[0]}</span></span>
        <span>Hasta: <span className="font-semibold" style={{color:"var(--color-primary-text)"}}>${priceRange[1]}</span></span>
      </div>

      {/* BRANDS / MFG */}
      {filterData.brands.length > 0 && (
         <div className="mb-6">
           <p className="text-sm font-semibold mb-3" style={{color:"var(--color-primary-text)"}}>Marcas</p>
           <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
             {filterData.brands.map(({ name, count }) => (
               <label key={`brand-${name}`} className="flex items-center gap-2 text-sm cursor-pointer" style={{color:"var(--color-secondary-text)"}}>
                 <input
                   type="checkbox"
                   checked={selectedBrands.includes(name)}
                   onChange={() => toggle(selectedBrands, setSelectedBrands, name)}
                   className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                 />
                 <span className="flex-1 truncate">{name}</span> 
                 <span className="text-xs text-gray-500">({count})</span>
               </label>
             ))}
           </div>
         </div>
      )}

      {/* TAGS */}
      {filterData.tags.length > 0 && (
         <div className="mb-6">
           <p className="text-sm font-semibold mb-3" style={{color:"var(--color-primary-text)"}}>Etiquetas</p>
           <div className="flex flex-wrap gap-2">
             {filterData.tags.map(({ name }) => {
               const isSelected = selectedTags.includes(name);
               return (
                 <button
                   key={`tag-${name}`}
                   onClick={() => toggle(selectedTags, setSelectedTags, name)}
                   className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                     isSelected 
                       ? "bg-blue-50 border-blue-200 text-blue-700" 
                       : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                   }`}
                 >
                   {name}
                 </button>
               );
             })}
           </div>
         </div>
      )}

      {/* COLORS */}
      {filterData.colors.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold mb-3" style={{color:"var(--color-primary-text)"}}>Color</p>
          <div className="space-y-2">
            {filterData.colors.map(({ name, count }) => (
              <label key={`color-${name}`} className="flex items-center gap-2 text-sm cursor-pointer" style={{color:"var(--color-secondary-text)"}}>
                <input
                  type="checkbox"
                  checked={selectedColors.includes(name)}
                  onChange={() => toggle(selectedColors, setSelectedColors, name)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="flex-1 truncate">{name}</span>
                <span className="text-xs text-gray-400">({count})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={applyFilters}
        className="w-full text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-sm"
        style={{ background: "var(--color-primary-bg)", color:" var(--color-tertiary-text)"}}
      >
        <Funnel className="w-4 h-4" />
        Aplicar Filtros
      </button>
    </div>
  );
};

export default ProductFilterSidebar;
