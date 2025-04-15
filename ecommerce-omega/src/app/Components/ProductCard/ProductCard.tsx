'use client'
import { FC } from "react";
import { ShoppingCart } from "lucide-react";

interface BadgeProps {
  label: string;
  color: string; // ej: 'bg-blue-500'
  textColor?: string;
}

export interface ProductCardProps {
    imageUrl: string;
    title: string;
    category?: string;
    color?: string; // ✅ nueva
    condition?: string; // ✅ nueva
    rating: number;
    seller: string;
    currentPrice: number;
    oldPrice: number;
  badge?: BadgeProps; // Opcional: si no se envía, se autogenera si hay descuento
}


const ProductCard: FC<ProductCardProps> = ({
  imageUrl,
  category,
  title,
  rating,
  seller,
  currentPrice,
  oldPrice,
  badge,
}) => {
  const hasDiscount = oldPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  const autoBadge: BadgeProps | undefined =
    !badge && hasDiscount
      ? {
          label: `-${discountPercent}%`,
          color: "bg-orange-400",
          textColor: "text-white",
        }
      : undefined;

  const finalBadge = badge || autoBadge;

  return (
    <div className="relative w-full max-w-xs bg-white border border-[#ECECEC] rounded-[15px] overflow-hidden p-4 flex flex-col justify-between shadow-sm transition-transform duration-200 ease-in-out hover:scale-[1.015] hover:shadow-lg">
      {finalBadge && (
        <span
        className={`absolute top-0 left-0 px-3 py-1 text-xs font-semibold rounded-tl-[15px] rounded-br-[1px] ${finalBadge.color} ${
          finalBadge.textColor || "text-white"
        }`}
        style={{
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        {finalBadge.label}
      </span>
      )}

      <div className=" rounded-md p-2">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-40 object-contain mx-auto"
        />
      </div>

      <div className="mt-3 flex-grow">
        <p className="text-gray-400 text-xs mb-1">{category}</p>

        <h3 className="text-[16px] font-semibold text-gray-800 leading-snug mb-1">
          {title}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-1">
          <span className="text-yellow-400 text-[16px]">★</span>
          <span className="ml-1 text-[14px]">({rating.toFixed(1)})</span>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          By <span className="text-green-600">{seller}</span>
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-green-600 font-bold text-[18px]">
            ${currentPrice.toFixed(2)}
          </span>
          <span className="text-gray-400 line-through text-sm">
            ${oldPrice.toFixed(1)}
          </span>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 text-sm bg-green-100 text-green-700 font-medium py-2 rounded-md hover:bg-green-200 transition">
        <ShoppingCart className="w-4 h-4" />
        Agregar
      </button>
    </div>
  );
};

export default ProductCard;
