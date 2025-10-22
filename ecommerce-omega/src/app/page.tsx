"use client";

import React, { useMemo } from "react";
import Navbar from "./Components/NavigationBar/NavBar";
import Footer from "./Components/Footer/Footer";
import ProductListSection from "./Components/ProductListSection/ProductListSection";
import { Product } from "./Components/ProductCardGrid/ProductCardGrid";
import { useConfig } from "./ConfigProvider/ConfigProvider";
import type { ProductoConfig } from "@/lib/config.types";

/* ---------- helpers de tipado ---------- */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isBadge(v: unknown): v is NonNullable<ProductoConfig["badge"]> {
  return isRecord(v) && typeof v.label === "string";
}

function isProductoConfig(p: unknown): p is ProductoConfig {
  if (!isRecord(p)) return false;
  return (
    typeof p.id === "string" &&
    typeof p.imageUrl === "string" &&
    typeof p.category === "string" &&
    typeof p.title === "string" &&
    typeof p.rating === "number" &&
    typeof p.brand === "string" &&
    typeof p.currentPrice === "number" &&
    typeof p.oldPrice === "number" &&
    typeof p.color === "string" &&
    typeof p.condition === "string" &&
    (p.badge === undefined || isBadge(p.badge))
  );
}

function isProductoConfigArray(v: unknown): v is ProductoConfig[] {
  return Array.isArray(v) && v.every(isProductoConfig);
}

/* ---------- mapper ---------- */
function mapProductosToUI(items: ProductoConfig[]): Product[] {
  return items.map((p, idx) => ({
    id: p.id ?? String(idx + 1),
    imageUrl: p.imageUrl,
    title: p.title,
    category: p.category, // slug para ?categoria=
    rating: Number.isFinite(p.rating) ? p.rating : 0,
    brand: p.brand ?? "Sin marca",
    currentPrice: p.currentPrice,
    oldPrice: p.oldPrice ?? p.currentPrice,
    color: p.color ?? "",
    condition: p.condition ?? "New",
    badge: p.badge
      ? {
          label: p.badge.label,
          color: p.badge.color ?? "bg-blue-500",
          textColor: p.badge.textColor,
        }
      : undefined,
  }));
}

/* ---------- página ---------- */
export default function Home() {
  const config = useConfig();

  // ✅ Refinamos el tipo de Productos sin usar `as`
  const productosCfg: ProductoConfig[] = useMemo(
    () => (isProductoConfigArray(config?.Productos) ? config.Productos : []),
    [config?.Productos]
  );

  const products: Product[] = useMemo(
    () => mapProductosToUI(productosCfg),
    [productosCfg]
  );

  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex flex-col pt-4 gap-8">
        {products.length > 0 ? (
          <ProductListSection title="Ofertas destacadas" products={products} showFilter />
        ) : (
          <div className="text-center py-16 text-gray-500">Sin productos por ahora. 🚧</div>
        )}
      </main>
      <Footer />
    </div>
  );
}
