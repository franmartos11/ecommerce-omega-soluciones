"use client";

import { useMemo } from "react";
import { Package, TrendingUp } from "lucide-react";

type OrderItem = {
  title: string;
  quantity: number;
  price: number;
};

type Order = {
  status: string;
  items?: OrderItem[];
};

interface BestSellersListProps {
  orders: Order[];
}

export function BestSellersList({ orders }: BestSellersListProps) {
  const bestSellers = useMemo(() => {
    const productStats: Record<string, { qty: number; rev: number }> = {};

    // Filter valid orders
    const validOrders = orders.filter(o => o.status !== "cancelado");

    validOrders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (!item.title) return;
          const normalizedTitle = item.title.trim();
          
          if (!productStats[normalizedTitle]) {
            productStats[normalizedTitle] = { qty: 0, rev: 0 };
          }
          productStats[normalizedTitle].qty += item.quantity || 1;
          productStats[normalizedTitle].rev += (item.price || 0) * (item.quantity || 1);
        });
      }
    });

    // Convert to array and sort by quantity sold
    const sortedProducts = Object.entries(productStats)
      .map(([title, stats]) => ({
        title,
        quantity: stats.qty,
        revenue: stats.rev,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5); // top 5

    return sortedProducts;
  }, [orders]);

  if (bestSellers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            Productos Más Vendidos
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
          <Package className="w-10 h-10 mb-2 opacity-20" />
          <p className="text-sm">No hay suficientes ventas para generar el ranking aún.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Top 5 Más Vendidos
        </h2>
      </div>

      <div className="flex-1 divide-y divide-gray-50 p-2">
        {bestSellers.map((product, idx) => (
          <div key={idx} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
            {/* Rank badge */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm
              ${idx === 0 ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : 
                idx === 1 ? "bg-gray-100 text-gray-600 border border-gray-300" :
                idx === 2 ? "bg-orange-50 text-orange-700 border border-orange-200" :
                "bg-gray-50 text-gray-400 border border-gray-100"}
            `}>
              #{idx + 1}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate" title={product.title}>
                {product.title}
              </p>
              <p className="text-xs text-blue-600 font-medium mt-0.5">
                {product.quantity} unidades vendidas
              </p>
            </div>
            
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-900">
                ${product.revenue.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
