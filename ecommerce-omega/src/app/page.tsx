"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/components/ProductCardGrid/ProductCardGrid";
import ProductListSection from "@/components/ProductListSection/ProductListSection";
import PromoCategoryCarousel from "@/components/PromoCategoryCarousel/PromoCategoryCarousel";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { useConfig } from "./ConfigProvider/ConfigProvider";
import { fetchProducts } from "@/services/productService";
import RecentlyViewed from "@/components/RecentlyViewed/RecentlyViewed";

/* ========= Página ========= */
export default function Home() {
  const config = useConfig();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const apiProducts = await fetchProducts();
        if (mounted) {
          setProducts(apiProducts ?? []);
        }
      } catch {
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProducts();
    return () => { mounted = false; };
  }, []);

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
          loading={loading}
          showFilter
        />

        {/* Dynamic Category Promo Carousels — Only show when products loaded */}
        {!loading && config?.home?.promoCategories
          ?.filter((promo) => promo.active)
          .map((promo) => {
            let categoryProducts: Product[] = [];

            if (promo.productIds && promo.productIds.length > 0) {
              categoryProducts = products.filter((p) => promo.productIds!.includes(p.id));
            } else {
              categoryProducts = products.filter((p) => {
                if (!p.category) return false;
                return p.category.toLowerCase() === promo.categorySlug.toLowerCase();
              });
            }

            if (categoryProducts.length === 0) return null;

            return (
              <div key={promo.id} className="-mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 bg-white/50 border-y border-gray-100 mt-8">
                <PromoCategoryCarousel
                  title={promo.title}
                  bannerImage={promo.bannerImage}
                  bannerLink={promo.bannerLink}
                  products={categoryProducts}
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
