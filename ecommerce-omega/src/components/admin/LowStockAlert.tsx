"use client";

import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import { AlertTriangle, PackageOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

type LowStockItem = {
  id: string;
  title: string;
  sku: string;
  stock: number;
  imageUrl: string;
};

export default function LowStockAlert() {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLowStock() {
      try {
        const res = await fetch("/api/admin/inventory?low=true");
        if (res.ok) {
          const data = await res.json();
          // Filter out items with no stock, we want to know what's *low*, but 0 is also critical.
          setItems(data?.slice(0, 5) || []); // Get top 5 most critical
        }
      } catch (error) {
        console.error("Error fetching low stock:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLowStock();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
         <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
         <div className="space-y-3">
           {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 rounded w-full"></div>)}
         </div>
      </div>
    );
  }

  if (items.length === 0) return null; // Don't show the widget if everything is fine

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden flex flex-col h-full animate-in fade-in">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <h2 className="text-base sm:text-lg font-bold">Alertas de Stock</h2>
        </div>
        <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">
          {items.length} urgentes
        </span>
      </div>

      {/* List */}
      <div className="p-2 sm:p-3 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((item) => (
             <li key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group transition-colors">
                {item.imageUrl ? (
                  <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                    <NextImage src={item.imageUrl} alt={item.title} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <PackageOpen className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate" title={item.title}>{item.title}</p>
                  {item.sku && <p className="text-[10px] text-gray-500 font-mono mt-0.5">SKU: {item.sku}</p>}
                </div>
                
                <div className="flex flex-col items-end flex-shrink-0 pl-2">
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-md border ${
                    item.stock === 0 
                      ? "bg-red-50 text-red-700 border-red-100" 
                      : "bg-orange-50 text-orange-700 border-orange-100"
                  }`}>
                    {item.stock} u.
                  </span>
                  {item.stock === 0 && <span className="text-[10px] text-red-500 font-medium uppercase mt-1">Agotado</span>}
                </div>
             </li>
          ))}
        </ul>
      </div>

      {/* Footer Link */}
      <div className="p-3 border-t border-gray-50 bg-gray-50 mt-auto">
        <Link 
          href="/admin/inventory" 
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 group w-full"
        >
          Gestionar inventario
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
