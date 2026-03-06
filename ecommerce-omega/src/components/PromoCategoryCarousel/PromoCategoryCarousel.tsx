"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/components/ProductCardGrid/ProductCardGrid";
import ProductCard from "@/components/ProductCard/ProductCard";

interface PromoCategoryCarouselProps {
  title: string;
  bannerImage: string;
  bannerLink?: string;
  products: Product[];
}

export default function PromoCategoryCarousel({
  title,
  bannerImage,
  bannerLink,
  products,
}: PromoCategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="w-full flex flex-col gap-6 py-8">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-geist-sans)]" style={{ color: "var(--color-primary-text)" }}>
        {title}
      </h2>

      {/* Main Grid: Banner left, Carousel right */}
      <div className="flex flex-col lg:flex-row gap-6 relative">
        
        {/* Scroll Buttons (Absolute positioned for the carousel side) */}
        <div className="hidden lg:block absolute left-[310px] top-1/2 -mt-5 z-10">
           <button 
             onClick={scrollLeft}
             className="bg-white/90 shadow rounded-full p-2 text-gray-700 hover:text-black hover:bg-white transition"
             aria-label="Scroll left"
           >
             <ChevronLeft className="w-6 h-6" />
           </button>
        </div>
        
        <div className="hidden lg:block absolute right-0 top-1/2 -mt-5 z-10">
           <button 
             onClick={scrollRight}
             className="bg-white/90 shadow border border-gray-100 rounded-full p-2 text-gray-700 hover:text-black hover:bg-white transition"
             aria-label="Scroll right"
           >
             <ChevronRight className="w-6 h-6" />
           </button>
        </div>

        {/* Left Column: Promotional Vertical Banner */}
        <div className="w-full lg:w-[300px] shrink-0 h-[350px] lg:h-[480px] rounded-xl overflow-hidden relative group shadow-sm bg-gray-100 flex items-center justify-center">
          {bannerLink ? (
            <Link href={bannerLink} className="w-full h-full block">
              <img
                src={bannerImage}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ) : (
             <img
                src={bannerImage}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
             />
          )}
        </div>

        {/* Right Column: Horizontal Scrolling Carousel of Product Cards */}
        <div 
           ref={scrollRef}
           className="flex-1 flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory pt-2 pb-6 px-1 lg:pl-4"
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[240px] sm:w-[260px] lg:w-[280px]">
              <ProductCard
                id={product.id}
                imageUrl={product.imageUrl}
                category={product.category}
                title={product.title}
                rating={product.rating}
                brand={product.brand}
                currentPrice={product.currentPrice}
                oldPrice={product.oldPrice || product.currentPrice * 1.25}
                badge={product.badge}
              />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
