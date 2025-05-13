'use client';

import React, { FC, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/utils/CartUtils";

interface BadgeProps {
  label: string;
  color: string; // e.g. 'bg-blue-500'
  textColor?: string;
}

export interface ProductCardProps {
  id: string;
  imageUrl: string;
  title: string;
  category?: string;
  rating: number;
  seller: string;
  currentPrice: number;
  oldPrice: number;
  badge?: BadgeProps;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  imageUrl,
  category,
  title,
  rating,
  seller,
  currentPrice,
  oldPrice,
  badge,
}) => {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const hasDiscount = oldPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  const autoBadge: BadgeProps | undefined =
    !badge && hasDiscount
      ? {
          label: `-${discountPercent}%`,
          color: "bg-orange-400",
          textColor: "text-white ",
        }
      : undefined;

  const finalBadge = badge || autoBadge;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // evita que dispare el onClick del contenedor
    addToCart({ id, title, imageUrl, price: currentPrice }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div
      onClick={() => router.push(`/ProductoDetailPage/${id}`)}
      className="cursor-pointer relative w-full max-w-xs bg-white border border-[#ECECEC] rounded-[15px] overflow-hidden p-4 flex flex-col justify-between shadow-sm transition-transform duration-200 ease-in-out hover:scale-[1.015] hover:shadow-lg"
    >
      {finalBadge && (
        <span
          className={`absolute top-0 left-0 px-3 py-1 text-xs font-semibold rounded-tl-[15px] ${finalBadge.color} ${finalBadge.textColor || "text-white"}`}
          style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0 }}
        >
          {finalBadge.label}
        </span>
      )}

      <div className="rounded-md p-2">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-40 object-contain mx-auto"
        />
      </div>

      <div className="mt-3 flex-grow">
        {category && <p className="text-gray-400 text-xs mb-1">{category}</p>}

        <h3 className="text-[16px] font-semibold text-gray-800 leading-snug mb-1">
          {title}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-1">
          <span className="text-yellow-400 text-[16px]">★</span>
          <span className="ml-1 text-[14px]">({rating.toFixed(1)})</span>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          By <span className="text-text1">{seller}</span>
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-text1 font-bold text-[18px]">
            ${currentPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-gray-400 line-through text-sm">
              ${oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="cursor-pointer  w-full flex items-center justify-center gap-2 text-sm bg-bg1 text-white font-medium py-2 rounded-md hover:bg-bg2 transition"
      >
        <ShoppingCart className="w-4 h-4" />
        Agregar
      </button>

      {added && (
        <p className="text-center text-sm text-text1 mt-2">
          ¡Agregado al carrito!
        </p>
      )}
    </div>
  );
};

export default ProductCard;
