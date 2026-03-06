"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Globe, ShoppingBag, LayoutDashboard } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname === "/admin";
  const isSettings = pathname?.startsWith("/admin/settings");
  const isOrders = pathname?.startsWith("/admin/orders");
  const isProducts = pathname?.startsWith("/admin/productos");
  const isReviews = pathname?.startsWith("/admin/reviews");

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 font-bold text-xl tracking-tight text-gray-800">
          Omega Admin
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          
          <div className="pt-2 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Gestión
          </div>

          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            isDashboard ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-medium">Inicio</span>
          </Link>
          
          <Link href="/admin/orders" className={`flex items-center gap-3 px-3 py-2 mt-1 rounded-md transition-colors ${
            isOrders ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}>
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-medium">Ventas</span>
          </Link>

          <Link href="/admin/productos" className={`flex items-center gap-3 px-3 py-2 mt-1 rounded-md transition-colors ${
            isProducts ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}>
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-medium">Productos</span>
          </Link>

          <Link href="/admin/categorias" className={`flex items-center gap-3 px-3 py-2 mt-1 rounded-md transition-colors ${
            pathname?.startsWith("/admin/categorias") ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}>
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-medium">Categorías</span>
          </Link>

          <Link href="/admin/reviews" className={`flex items-center gap-3 px-3 py-2 mt-1 rounded-md transition-colors ${
            isReviews ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}>
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-medium">Reseñas</span>
          </Link>

          <div className="pt-6 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Ajustes
          </div>
          
          <Link href="/admin/settings" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            isSettings ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}>
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Configuración</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Globe className="w-4 h-4" />
            Volver al Sitio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="font-bold text-lg">Omega Admin</div>
          <Link href="/" className="text-sm text-blue-600 font-medium">Volver</Link>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
}
