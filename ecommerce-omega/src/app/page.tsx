"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Product } from "@/components/ProductCardGrid/ProductCardGrid";
import ProductListSection from "@/components/ProductListSection/ProductListSection";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { useConfig } from "./ConfigProvider/ConfigProvider";

import { mapConfigProductsToUI } from "@/utils/productMapper";
import { fetchProducts } from "@/services/productService";

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
      </main>
      <Footer />
    </div>
  );
}
