"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Settings, Tag, MessageSquare, ArrowRight, DollarSign, Clock, TrendingUp, Loader2, PackageOpen } from "lucide-react";
import { SalesChart } from "@/components/admin/SalesChart";
import { BestSellersList } from "@/components/admin/BestSellersList";
import LowStockAlert from "@/components/admin/LowStockAlert";

type Order = {
  id: string;
  created_at: string;
  total: number | string;
  status: string;
  shipping?: { firstName?: string; lastName?: string };
};

const STATUS_STYLES: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  pagado: "bg-blue-100 text-blue-800",
  enviado: "bg-purple-100 text-purple-800",
  completado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // KPI computations
  const toNum = (v: number | string) =>
    typeof v === "number" ? v : parseFloat(v || "0");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter((o) => new Date(o.created_at) >= today);
  const todayRevenue = todayOrders.reduce((s, o) => s + toNum(o.total), 0);
  const totalRevenue = orders.reduce((s, o) => s + toNum(o.total), 0);
  const pendingOrders = orders.filter((o) => o.status === "pendiente").length;
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const kpis = [
    {
      label: "Ingresos Hoy",
      value: `$${todayRevenue.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      sub: `${todayOrders.length} órden${todayOrders.length !== 1 ? "es" : ""} hoy`,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      label: "Ingresos Totales",
      value: `$${totalRevenue.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      sub: `${orders.length} órdenes en total`,
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: "Pedidos Pendientes",
      value: String(pendingOrders),
      sub: pendingOrders === 0 ? "¡Todo al día! 🎉" : "Requieren atención",
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      bg: "bg-yellow-50",
    },
  ];

  const quickLinks = [
    {
      title: "Ventas y Órdenes",
      description: "Gestiona los pedidos, estados y cobros.",
      icon: <ShoppingBag className="w-6 h-6 text-blue-600" />,
      href: "/admin/orders",
      bgColor: "bg-blue-50",
    },
    {
      title: "Productos",
      description: "Añade, edita y organiza tu inventario.",
      icon: <Tag className="w-6 h-6 text-green-600" />,
      href: "/admin/productos",
      bgColor: "bg-green-50",
    },
    {
      title: "Configuración",
      description: "Ajusta colores, banners, envíos y más.",
      icon: <Settings className="w-6 h-6 text-purple-600" />,
      href: "/admin/settings",
      bgColor: "bg-purple-50",
    },
    {
      title: "Inventario Rápido",
      description: "Edita el stock de forma masiva.",
      icon: <PackageOpen className="w-6 h-6 text-indigo-600" />,
      href: "/admin/inventory",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Reseñas",
      description: "Revisa los comentarios de tus clientes.",
      icon: <MessageSquare className="w-6 h-6 text-orange-600" />,
      href: "/admin/reviews",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-0">
      {/* Header */}
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Panel de Administración</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-100 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-6 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))
          : kpis.map((k, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${k.bg} rounded-full flex items-center justify-center shrink-0`}>{k.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{k.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{k.value}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </div>
              </div>
            ))}
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col gap-6">
        
        {/* Top Row: Sales Chart */}
        <div className="w-full h-80 lg:h-96">
          {loading ? (
             <div className="w-full h-full bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center animate-pulse">
               <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary-bg)" }} />
             </div>
          ) : (
            <SalesChart orders={orders} days={14} />
          )}
        </div>

        {/* Bottom Row: Three Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Quick links */}
          <div className="flex flex-col gap-4">
          {quickLinks.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center shrink-0`}>
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                  {card.title}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h2>
                <p className="text-gray-500 text-xs mt-0.5 truncate">{card.description}</p>
              </div>
            </Link>
          ))}
          </div>
        
          {/* Col 2: Best Sellers & Low Stock */}
          <div className="flex flex-col h-full space-y-4">
            <div className="max-h-64 mb-2">
              <LowStockAlert />
            </div>
            {loading ? (
              <div className="w-full h-full bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary-bg)" }} />
              </div>
            ) : (
              <BestSellersList orders={orders} />
            )}
          </div>

          {/* Col 3: Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Últimas Órdenes</h2>
              <Link href="/admin/orders" className="text-xs font-medium text-blue-600 hover:underline">
                Ver todas →
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-primary-bg)" }} />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">Aún no hay órdenes.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentOrders.map((order) => {
                  const name = order.shipping
                    ? `${order.shipping.firstName || ""} ${order.shipping.lastName || ""}`.trim()
                    : "—";
                  const statusStyle = STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600";
                  return (
                    <div key={order.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500 truncate">{name || "Sin nombre"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900">
                          ${toNum(order.total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </p>
                        <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
