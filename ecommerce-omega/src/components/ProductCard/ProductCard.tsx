'use client';

import React, { FC, useState, useEffect } from "react";
import NextImage from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/utils/CartUtils";
import { isInWishlist, toggleWishlist } from "@/utils/WishlistUtils";
import { addRecentlyViewed } from "@/utils/RecentlyViewedUtils";
import toast from "react-hot-toast";

interface BadgeProps {
  label: string;
  color: string; 
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
  badgeText?: string | null;
  badgeColor?: string | null;
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
  badgeText,
  badgeColor,
  badge,
}) => {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(isInWishlist(id));
    const onUpdate = () => setWishlisted(isInWishlist(id));
    window.addEventListener("wishlistUpdated", onUpdate);
    return () => window.removeEventListener("wishlistUpdated", onUpdate);
  }, [id]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasAdded = toggleWishlist({
      id,
      title,
      imageUrl,
      currentPrice,
      oldPrice,
      category,
      rating,
      brand: seller,
    });
    toast(wasAdded ? "Agregado a favoritos ❤️" : "Eliminado de favoritos", {
      icon: wasAdded ? "❤️" : "💔",
      style: { borderRadius: "12px", background: "#333", color: "#fff", fontSize: "14px" },
      duration: 1500,
    });
  };

  const hasDiscount = oldPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  const autoBadge: BadgeProps | undefined =
    badgeText
      ? {
          label: badgeText,
          color: badgeColor ? badgeColor.split(" ")[0] : "bg-red-500",
          textColor: badgeColor ? badgeColor.split(" ")[1] : "text-white",
        }
      : (!badge && hasDiscount)
      ? {
          label: `-${discountPercent}%`,
          color: "bg-orange-400",
          textColor: "text-white",
        }
      : undefined;

  const finalBadge = badge || autoBadge;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, title, imageUrl, price: currentPrice }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Agregado al carrito", {
      style: { borderRadius: "12px", background: "#333", color: "#fff", fontSize: "14px" },
      duration: 1500,
    });
  };

  const handleProductClick = () => {
    addRecentlyViewed({ id, title, imageUrl, currentPrice, oldPrice, category, rating, brand: seller });
    router.push(`/ProductoDetailPage/${id}`);
  };

  return (
    <div
      onClick={handleProductClick}
      className="cursor-pointer relative w-full h-full max-w-xs border border-[#ECECEC] rounded-[15px] overflow-hidden p-4 flex flex-col justify-between shadow-sm transition-transform duration-200 ease-in-out hover:scale-[1.015] hover:shadow-lg"
      style={{ background: "var(--bgweb)", color: "var(--color-primary-text)" }}
    >
      {finalBadge && (
        <span
          className={`absolute top-0 left-0 z-10 px-3 py-1 text-xs font-semibold rounded-tl-[15px] ${finalBadge.color} ${finalBadge.textColor}`}
          style={{
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 0,
            color: "var(--color-tertiary-text)",
          }}
        >
          {finalBadge.label}
        </span>
      )}

      {/* Wishlist heart */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform cursor-pointer"
        aria-label={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <Heart
          className="w-4 h-4 transition-colors"
          fill={wishlisted ? "#ef4444" : "none"}
          color={wishlisted ? "#ef4444" : "#9ca3af"}
        />
      </button>

      <div className="rounded-md p-2 relative h-40">
        <NextImage
          src={imageUrl || "/placeholder.png"}
          alt={title}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      <div className="mt-3 flex-grow flex flex-col">
        <div className="min-h-[16px] mb-1">
          {category && (
            <p className="text-xs" style={{ color: "var(--color-secondary-text)" }}>
              {category}
            </p>
          )}
        </div>

        <h3
          className="text-[16px] font-semibold leading-snug mb-1 line-clamp-2 min-h-[44px]"
          style={{ color: "var(--color-primary-text)" }}
        >
          {title}
        </h3>

        <div className="mt-auto">
          <div
            className="flex items-center text-sm mb-1"
            style={{ color: "var(--color-secondary-text)" }}
          >
            <span className="text-yellow-400 text-[16px]">★</span>
            <span className="ml-1 text-[14px]">({rating.toFixed(1)})</span>
          </div>

          <p className="text-sm mb-2" style={{ color: "var(--color-secondary-text)" }}>
            By <span className="text-text1">{seller}</span>
          </p>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-text1 font-bold text-[18px]">
              ${currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span
                className="line-through text-sm"
                style={{ color: "var(--color-secondary-text)" }}
              >
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onMouseEnter={() => setHoveredBtn(true)}
        onMouseLeave={() => setHoveredBtn(false)}
        onClick={handleAddToCart}
        className="cursor-pointer w-full flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md transition"
        style={{
          background: hoveredBtn
            ? "var(--color-secondary-bg)"
            : "var(--color-primary-bg)",
          color: hoveredBtn
            ? "var(--color-tertiary-text)"
            : "var(--color-tertiary-text)",
        }}
      >
        <ShoppingCart className="w-4 h-4" />
        Agregar
      </button>

      {added && (
        <p className="text-center text-sm text-text1 mt-2">¡Agregado!</p>
      )}
    </div>
  );
};

export default ProductCard;
