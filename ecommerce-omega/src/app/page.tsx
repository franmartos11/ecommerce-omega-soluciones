"use client";

import React, { useMemo } from "react";
import { Product } from "./Components/ProductCardGrid/ProductCardGrid";
import ProductListSection from "./Components/ProductListSection/ProductListSection";
import Navbar from "./Components/NavigationBar/NavBar";
import Footer from "./Components/Footer/Footer";
import { useConfig } from "./ConfigProvider/ConfigProvider";

/* ========= Tipos auxiliares ========= */
type ConfigBadge = {
  label: string;
  color: string;
  textColor?: string;
};

type ConfigProductAny = {
  id?: string | number;

  imageUrl?: string;
  img?: string;
  image?: string;

  title?: string;
  nombre?: string;

  category?: string;
  categoria?: string;
  categorySlug?: string;
  slug?: string;

  rating?: number | string;
  brand?: string;
  marca?: string;

  currentPrice?: number | string;
  price?: number | string;
  oldPrice?: number | string;
  priceOld?: number | string;

  color?: string;
  condition?: string;
  condicion?: string;

  badge?: ConfigBadge | null | undefined;
};

/* ========= Type guards ========= */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isArrayOfProducts(v: unknown): v is ConfigProductAny[] {
  return Array.isArray(v);
}

function hasItemsArray(v: unknown): v is { items: ConfigProductAny[] } {
  return isRecord(v) && Array.isArray(v.items);
}

/** Heurística mínima para detectar un “producto” suelto (objeto único). */
function looksLikeSingleProduct(v: unknown): v is ConfigProductAny {
  if (!isRecord(v)) return false;
  return (
    "title" in v ||
    "nombre" in v ||
    "imageUrl" in v ||
    "img" in v ||
    "image" in v
  );
}

/* ========= Utils ========= */
function toNumber(n: unknown, fallback = 0): number {
  const num = typeof n === "string" ? Number(n) : (n as number);
  return Number.isFinite(num) ? (num as number) : fallback;
}

/* ========= Mapper principal ========= */
/** Acepta:
 * - Array de productos
 * - Objeto { items: [...] }
 * - Objeto único (producto suelto)
 */
function mapConfigProductsToUI(cfgProducts: unknown): Product[] {
  let items: ConfigProductAny[] = [];

  if (isArrayOfProducts(cfgProducts)) {
    items = cfgProducts;
  } else if (hasItemsArray(cfgProducts)) {
    items = cfgProducts.items;
  } else if (looksLikeSingleProduct(cfgProducts)) {
    items = [cfgProducts];
  }

  return items.map((it, idx) => {
    const id = String(it.id ?? idx + 1);
    const imageUrl = String(it.imageUrl ?? it.img ?? it.image ?? "");
    const title = String(it.title ?? it.nombre ?? "Producto");

    // Usamos el slug en `category` para filtrar con ?categoria=<slug>
    const categorySlug =
      it.categorySlug ?? it.slug ?? it.categoria ?? it.category ?? "";

    const rating = toNumber(it.rating, 0);
    const brand = String(it.brand ?? it.marca ?? "Sin marca");

    const currentPrice = toNumber(it.currentPrice ?? it.price, 0);
    const oldPrice = toNumber(
      it.oldPrice ?? it.priceOld ?? it.currentPrice ?? it.price,
      currentPrice
    );

    const color = String(it.color ?? "");
    const condition = String(it.condition ?? it.condicion ?? "New");

    const badge =
      it.badge &&
      typeof it.badge === "object" &&
      it.badge !== null &&
      "label" in it.badge
        ? {
            label: String((it.badge as ConfigBadge).label),
            color: String((it.badge as ConfigBadge).color ?? "bg-blue-500"),
            textColor:
              (it.badge as ConfigBadge).textColor !== undefined
                ? String((it.badge as ConfigBadge).textColor)
                : undefined,
          }
        : undefined;

    const product: Product = {
      id,
      imageUrl,
      title,
      category: categorySlug, // slug para el filtro
      rating,
      brand,
      currentPrice,
      oldPrice,
      color,
      condition,
      badge,
    };

    return product;
  });
}

/* ========= Página ========= */
export default function Home() {
  const config = useConfig();

  const products: Product[] = useMemo(() => {
    // mapper acepta unknown; no hay casts a any
    return mapConfigProductsToUI(config?.Productos);
  }, [config?.Productos]);

  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex flex-col pt-4 gap-8">
        <ProductListSection title="Ofertas destacadas" products={products} showFilter />
      </main>
      <Footer />
    </div>
  );
}
