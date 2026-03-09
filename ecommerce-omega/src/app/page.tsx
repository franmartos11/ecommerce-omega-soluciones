"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Product } from "@/components/ProductCardGrid/ProductCardGrid";
import ProductListSection from "@/components/ProductListSection/ProductListSection";
import PromoCategoryCarousel from "@/components/PromoCategoryCarousel/PromoCategoryCarousel";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { useConfig } from "./ConfigProvider/ConfigProvider";

import { mapConfigProductsToUI } from "@/utils/productMapper";
import { fetchProducts } from "@/services/productService";

import RecentlyViewed from "@/components/RecentlyViewed/RecentlyViewed";

/* ========= Página ========= */
export default function Home() {
  const config = useConfig();

  // mapper acepta unknown; no hay casts a any
  const configProducts: Product[] = useMemo(() => {
    return mapConfigProductsToUI(config?.Productos);
  }, [config?.Productos]);

  const [products, setProducts] = useState<Product[]>(configProducts);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const apiProducts = await fetchProducts();
        if (apiProducts) {
          if (mounted) setProducts(apiProducts);
        } else {
          if (mounted) setProducts(configProducts);
        }
      } catch {
        if (mounted) setProducts(configProducts);
      }
    }

    loadProducts();
    // Si config cambia, actualizar el fallback
    return () => {
      mounted = false;
    };
  }, [configProducts]);

  return (
    <div
      className=" min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]"
      style={{ background: "var(--bgweb)" }}
    >
      <Navbar />
      <main className="flex flex-col pt-4 gap-8">
        <ProductListSection
          title="Ofertas destacadas"
          products={products}
          showFilter
        />

        {/* Dynamic Category Promo Carousels */}
        {config?.home?.promoCategories
          ?.filter((promo) => promo.active)
          .map((promo) => {
            let categoryProducts: Product[] = [];
            
            if (promo.productIds && promo.productIds.length > 0) {
              // Filtrar por IDs específicos si están configurados
              categoryProducts = products.filter((p) => promo.productIds!.includes(p.id));
            } else {
              // Caso contrario, caer en el filtro por categoría
              categoryProducts = products.filter((p) => {
                if (!p.category) return false;
                return p.category.toLowerCase() === promo.categorySlug.toLowerCase();
              });
            }
            
            // Si la categoría no tiene productos para mostrar (ej: en dev inicial), 
            // mostramos todos los productos para que no quede vació el carrusel
            const displayProducts = categoryProducts.length > 0 ? categoryProducts : products;

            return (
              <div key={promo.id} className="-mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 bg-white/50 border-y border-gray-100 mt-8">
                <PromoCategoryCarousel
                  title={promo.title}
                  bannerImage={promo.bannerImage}
                  bannerLink={promo.bannerLink}
                  products={displayProducts}
                />
              </div>
            );
          })}

        <RecentlyViewed />
      </main>
      <Footer />
    </div>
  );
}
