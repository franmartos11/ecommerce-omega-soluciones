"use client";

import React, { useEffect, useState } from "react";
import { getRecentlyViewed, RecentlyViewedItem } from "@/utils/RecentlyViewedUtils";
import ProductCard from "@/components/ProductCard/ProductCard";

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: "var(--color-primary-text)" }}
      >
        Vistos recientemente
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.slice(0, 6).map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            imageUrl={item.imageUrl}
            title={item.title}
            currentPrice={item.currentPrice}
            oldPrice={item.oldPrice}
            category={item.category}
            rating={item.rating}
            brand={item.brand}
          />
        ))}
      </div>
    </section>
  );
}
