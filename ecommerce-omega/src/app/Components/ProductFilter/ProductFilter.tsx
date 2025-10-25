"use client";

import { FC, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import { Funnel } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Tipado para los filtros
interface Filters {
  priceRange: number[];
  colors: string[];
  conditions: string[];
}

interface FilterSidebarProps {
  onFilter: (filters: Filters) => void;
}

const STEP = 10;
const MIN = 0;
const MAX = 20000;

const colors = [
  { name: "Red", count: 56 },
  { name: "Green", count: 78 },
  { name: "Blue", count: 54 },
];

const conditions = [
  { name: "New", count: 1506 },
  { name: "Refurbished", count: 27 },
  { name: "Used", count: 45 },
];

const ProductFilterSidebar: FC<FilterSidebarProps> = ({ onFilter }) => {
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("precio_min")) || 0,
    Number(searchParams.get("precio_max")) || 20000,
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>(searchParams.getAll("color") || []);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(searchParams.getAll("condicion") || []);

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
      conditions: selectedConditions,
    });
  };

  return (
    <div className="w-full max-w-xs rounded-xl border border-gray-200 p-4 shadow-sm">
      <h2 className="text-lg font-semibold  mb-4" style={{ color:"var(--color-primary-text)"}}>Filtro Precio</h2>

      {/* PRICE RANGE */}
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
              className="h-4 w-4 rounded-full bg-bg1 shadow"
            />
          );
        }}
      />
      <div className="flex justify-between text-sm mb-4" style={{ color:"var(--color-secondary-text)"}}>
        <span>Desde: <span className="text-text1">${priceRange[0]}</span></span>
        <span>Hasta: <span className="text-text1">${priceRange[1]}</span></span>
      </div>

      {/* COLORS */}
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2" style={{color:"var(--color-primary-text)"}}>Color</p>
        {colors.map(({ name, count }) => (
          <label key={name} className="flex items-center gap-2 text-sm mb-1" style={{color:"var(--color-secondary-text)"}}>
            <input
              type="checkbox"
              checked={selectedColors.includes(name)}
              onChange={() => toggle(selectedColors, setSelectedColors, name)}
              className=" cursor-pointer accent-bg1"
            />
            {name} ({count})
          </label>
        ))}
      </div>

      {/* CONDITION */}
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2" style={{color:"var(--color-primary-text)"}}>Condición</p>
        {conditions.map(({ name, count }) => (
          <label key={name} className="flex items-center gap-2 text-sm  mb-1" style={{color:"var(--color-secondary-text)"}}>
            <input
              type="checkbox"
              checked={selectedConditions.includes(name)}
              onChange={() => toggle(selectedConditions, setSelectedConditions, name)}
              className="cursor-pointer accent-text2"
            />
            {name} ({count})
          </label>
        ))}
      </div>

      {/* BUTTON */}
      <button
        onClick={applyFilters}
        className="cursor-pointer w-full text-sm font-medium py-2 rounded flex items-center justify-center gap-2"
        style={{ background: "var(--color-primary-bg)",color:" var(--color-tertiary-text)"}}
      >
        <Funnel className="w-4 h-4" />
        Filtrar
      </button>
    </div>
  );
};

export default ProductFilterSidebar;
