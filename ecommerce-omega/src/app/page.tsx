"use client";

import React, { useMemo } from "react";
import { Product } from "./Components/ProductCardGrid/ProductCardGrid";
import ProductListSection from "./Components/ProductListSection/ProductListSection";
import Navbar from "./Components/NavigationBar/NavBar";
import Footer from "./Components/Footer/Footer";
import { useConfig } from "./ConfigProvider/ConfigProvider";

/**
 * Aceptamos múltiples variantes de esquema de productos en tu config.json
 * para evitar errores de tipeo por nombres distintos.
 */
type ConfigCategoria = {
  id: string;
  nombre: string;
  slug: string;
  iconUrl?: string;
};

type ConfigBadge = {
  label: string;
  color: string;      // ej "bg-blue-500"
  textColor?: string; // ej "text-white"
};

type ConfigProductAny = {
  id?: string | number;
  // imágenes
  imageUrl?: string;
  img?: string;
  image?: string;

  // título
  title?: string;
  nombre?: string;

  // categoría (ideal: slug)
  category?: string;       // podría venir como nombre o slug
  categoria?: string;      // puede ser nombre o slug
  categorySlug?: string;   // preferido
  slug?: string;           // fallback

  // calificaciones / marca
  rating?: number | string;
  brand?: string;
  marca?: string;

  // precios
  currentPrice?: number | string;
  price?: number | string;
  oldPrice?: number | string;
  priceOld?: number | string;

  // extras
  color?: string;
  condition?: string;  // "New" | "Used" | "Refurbished" (o lo que manejes)
  condicion?: string;

  badge?: ConfigBadge | null | undefined;
};

function toNumber(n: unknown, fallback = 0): number {
  const num = typeof n === "string" ? Number(n) : (n as number);
  return Number.isFinite(num) ? (num as number) : fallback;
}

/**
 * Mapea los productos del config hacia el tipo `Product` que consume tu grid.
 * - category: usamos **slug** si está disponible (categorySlug/slug/categoria/category).
 *   Esto mantiene compatible el filtro por `?categoria=<slug>`.
 * - ProductCard mostrará el string que reciba en `category` tal cual;
 *   si querés mostrar el **nombre legible** en la card, podés convertir slug -> nombre
 *   en este mapper usando `config.Categorias`.
 */
function mapConfigProductsToUI(
  cfgProducts: unknown,
  categorias?: ConfigCategoria[]
): Product[] {
  // 1) Obtener array de productos desde varias formas posibles
  const items: ConfigProductAny[] = Array.isArray(cfgProducts)
    ? (cfgProducts as ConfigProductAny[])
    : Array.isArray((cfgProducts as any)?.items)
    ? ((cfgProducts as any).items as ConfigProductAny[])
    : [];

  // helper slug->nombre (por si querés renderizar nombre humano en la tarjeta)
  const nombreFromSlug = (slug?: string | null) => {
    if (!slug || !categorias?.length) return slug ?? "";
    const found = categorias.find((c) => c.slug?.toLowerCase() === slug.toLowerCase());
    return found?.nombre ?? slug;
  };

  return items.map((it, idx) => {
    const id = String(it.id ?? idx + 1);

    const imageUrl = String(it.imageUrl ?? it.img ?? it.image ?? "");

    const title = String(it.title ?? it.nombre ?? "Producto");

    // Resolver slug de categoría (preferimos categorySlug/slug)
    const categorySlug =
      (it.categorySlug as string) ??
      (it.slug as string) ??
      (it.categoria as string) ??
      (it.category as string) ??
      "";

    // Si querés que la Card muestre el **nombre legible** en vez del slug:
    // const categoryForCard = nombreFromSlug(categorySlug);
    // Si preferís mostrar el **slug** (compatible con filtros actuales):
    const categoryForCard = categorySlug;

    const rating = toNumber(it.rating, 0);

    const brand = String(it.brand ?? it.marca ?? "Sin marca");

    const currentPrice = toNumber(it.currentPrice ?? it.price, 0);
    const oldPrice = toNumber(it.oldPrice ?? it.priceOld ?? it.currentPrice ?? it.price, currentPrice);

    const color = String(it.color ?? "");
    const condition = String(it.condition ?? it.condicion ?? "New");

    const badge =
      it.badge && it.badge.label
        ? {
            label: String(it.badge.label),
            color: String(it.badge.color ?? "bg-blue-500"),
            textColor: it.badge.textColor ? String(it.badge.textColor) : undefined,
          }
        : undefined;

    const product: Product = {
      id,
      imageUrl,
      title,
      category: categoryForCard, // 🔹 acá va lo que se muestra en la tarjeta y lo que filtra
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

export default function Home() {
  const config = useConfig();

  // Productos finales para la UI
  const products: Product[] = useMemo(() => {
    return mapConfigProductsToUI(config?.Productos, config?.Categorias);
  }, [config?.Productos, config?.Categorias]);

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

