"use client";

import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-xs border border-gray-100 rounded-[15px] overflow-hidden p-4 flex flex-col animate-pulse">
      {/* Image placeholder */}
      <div className="rounded-md bg-gray-200 h-40 w-full mb-3" />

      {/* Category */}
      <div className="h-3 bg-gray-200 rounded w-16 mb-2" />

      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-full mb-1" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

      {/* Rating */}
      <div className="h-3 bg-gray-200 rounded w-12 mb-2" />

      {/* Brand */}
      <div className="h-3 bg-gray-200 rounded w-20 mb-3" />

      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-100 rounded w-12" />
      </div>

      {/* Button */}
      <div className="h-9 bg-gray-200 rounded-md w-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
