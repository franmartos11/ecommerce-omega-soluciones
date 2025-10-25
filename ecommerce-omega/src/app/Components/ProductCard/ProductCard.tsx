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
  brand: string;
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
  brand: seller,
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
      className="cursor-pointer relative w-full max-w-xs  border border-[#ECECEC] rounded-[15px] overflow-hidden p-4 flex flex-col justify-between shadow-sm transition-transform duration-200 ease-in-out hover:scale-[1.015] hover:shadow-lg"
      style={{background: "var(--bgweb)", color:"var(--color-primary-text)"}}
    >
      {finalBadge && (
        <span
          className={`absolute top-0 left-0 px-3 py-1 text-xs font-semibold rounded-tl-[15px] ${finalBadge.color} ${finalBadge.textColor }`}
          style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0 , color:"var(--color-tertiary-text)"}}
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
        {category && <p className=" text-xs mb-1" style={{ color:"var(--color-secondary-text)"}}>{category}</p>}

        <h3 className="text-[16px] font-semiboldleading-snug mb-1" style={{ color:"var(--color-primary-text)"}}>
          {title}
        </h3>

        <div className="flex items-center text-sm  mb-1" style={{ color:"var(--color-secondary-text)"}}>
          <span className="text-yellow-400 text-[16px]">★</span>
          <span className="ml-1 text-[14px]">({rating.toFixed(1)})</span>
        </div>

        <p className="text-sm mb-2" style={{ color:"var(--color-secondary-text)"}}>
          By <span className="text-text1">{seller}</span>
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-text1 font-bold text-[18px]">
            ${currentPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className=" line-through text-sm" style={{ color:"var(--color-secondary-text)"}}>
              ${oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="cursor-pointer  w-full flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md transition"
        style={{ color:"var(--color-tertiary-text)",background: "var(--color-primary-bg)" }}
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
