"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import {
  getWishlist,
  removeFromWishlist,
  WishlistItem,
} from "@/utils/WishlistUtils";
import { addToCart } from "@/utils/CartUtils";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    setItems(getWishlist());

    const onUpdate = () => setItems(getWishlist());
    window.addEventListener("wishlistUpdated", onUpdate);
    return () => window.removeEventListener("wishlistUpdated", onUpdate);
  }, []);

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    setItems(getWishlist());
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart(
      {
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        price: item.currentPrice,
      },
      1
    );
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div
      className="min-h-screen font-[family-name:var(--font-geist-sans)]"
      style={{ background: "var(--bgweb)" }}
    >
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <Breadcrumbs items={[{ label: "Mis Favoritos" }]} />

        <div className="flex items-center gap-3 mb-6">
          <Heart
            className="w-7 h-7"
            fill="var(--color-primary-bg)"
            style={{ color: "var(--color-primary-bg)" }}
          />
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-primary-text)" }}
          >
            Mis Favoritos
          </h1>
          <span
            className="text-sm px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "var(--color-primary-bg)",
              color: "var(--color-tertiary-text)",
            }}
          >
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Heart
              className="w-16 h-16 mx-auto mb-4 opacity-20"
              style={{ color: "var(--color-secondary-text)" }}
            />
            <p
              className="text-lg font-medium mb-2"
              style={{ color: "var(--color-primary-text)" }}
            >
              Tu lista de favoritos está vacía
            </p>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-secondary-text)" }}
            >
              Explorá la tienda y agregá productos que te gusten
            </p>
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-transform hover:scale-105"
              style={{
                background: "var(--color-primary-bg)",
                color: "var(--color-tertiary-text)",
              }}
            >
              Ir a la tienda
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/ProductoDetailPage/${item.id}`)
                    }
                  >
                    <div className="relative h-48 bg-gray-50 p-4">
                      <img
                        src={item.imageUrl || "/placeholder.png"}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      {item.category && (
                        <p
                          className="text-xs mb-1"
                          style={{ color: "var(--color-secondary-text)" }}
                        >
                          {item.category}
                        </p>
                      )}
                      <h3
                        className="font-semibold text-sm line-clamp-2 mb-2"
                        style={{ color: "var(--color-primary-text)" }}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-lg font-bold"
                          style={{ color: "var(--color-primary-bg)" }}
                        >
                          ${item.currentPrice.toFixed(2)}
                        </span>
                        {item.oldPrice > item.currentPrice && (
                          <span
                            className="line-through text-sm"
                            style={{ color: "var(--color-secondary-text)" }}
                          >
                            ${item.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        background: "var(--color-primary-bg)",
                        color: "var(--color-tertiary-text)",
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar al carro
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="cursor-pointer p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Eliminar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
