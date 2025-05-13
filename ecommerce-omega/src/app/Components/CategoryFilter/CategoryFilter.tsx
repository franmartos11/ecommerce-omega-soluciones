import { FC } from "react";

export interface Category {
  label: string;
  iconUrl: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

const CategoryFilter: FC<CategoryFilterProps> = ({ categories, selected, onSelect }) => {
  const toggleCategory = (label: string) => {
    onSelect(selected === label ? null : label);
  };

  return (
    <div className="w-full max-w-xs rounded-xl border border-gray-200 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Categorías</h2>
      <div className="space-y-2">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => toggleCategory(cat.label)}
            className={` cursor-pointer w-full flex items-center gap-3 px-4 py-2 rounded-lg border transition ${
              selected === cat.label
                ? "border-border bg-green-50 text-border2"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <img
              src={cat.iconUrl}
              alt={cat.label}
              className="w-6 h-6 object-contain"
              loading="lazy"
            />
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
