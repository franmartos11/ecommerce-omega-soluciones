"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Globe, ShoppingBag, LayoutDashboard, Tag, MessageSquare, Menu, X, PackageOpen, Truck } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDashboard = pathname === "/admin";
  const isSettings = pathname?.startsWith("/admin/settings");
  const isOrders = pathname?.startsWith("/admin/orders");
  const isProducts = pathname?.startsWith("/admin/productos");
  const isInventory = pathname?.startsWith("/admin/inventory");
  const isCategories = pathname?.startsWith("/admin/categorias");
  const isShipping = pathname?.startsWith("/admin/shipping");
  const isMarketing = pathname?.startsWith("/admin/marketing");
  const isReviews = pathname?.startsWith("/admin/reviews");

  const navLinks = [
    { href: "/admin", label: "Inicio", icon: <LayoutDashboard className="w-5 h-5" />, active: isDashboard, heading: "GESTIÓN" },
    { href: "/admin/orders", label: "Ventas", icon: <ShoppingBag className="w-5 h-5" />, active: isOrders },
    { href: "/admin/productos", label: "Productos", icon: <Tag className="w-5 h-5" />, active: isProducts },
    { href: "/admin/inventory", label: "Inventario", icon: <PackageOpen className="w-5 h-5" />, active: isInventory },
    { href: "/admin/categorias", label: "Categorías", icon: <ShoppingBag className="w-5 h-5" />, active: isCategories },
    { href: "/admin/shipping", label: "Envíos", icon: <Truck className="w-5 h-5" />, active: isShipping },
    { href: "/admin/marketing", label: "Marketing", icon: <Tag className="w-5 h-5" />, active: isMarketing },
    { href: "/admin/reviews", label: "Reseñas", icon: <MessageSquare className="w-5 h-5" />, active: isReviews, heading: "AJUSTES" },
    { href: "/admin/settings", label: "Configuración", icon: <Settings className="w-5 h-5" />, active: isSettings },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-gray-200 font-bold text-xl tracking-tight text-gray-800 shrink-0">
        Omega Admin
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navLinks.map((link, i) => (
          <div key={link.href}>
            {link.heading && (
              <div className={`px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${i === 0 ? "pt-2 pb-2" : "pt-6 pb-2"}`}>
                {link.heading}
              </div>
            )}
            <Link
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                link.active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.icon}
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 shrink-0">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <Globe className="w-4 h-4" />
          Volver al Sitio
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans text-gray-900">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar slide-in */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-white flex flex-col shadow-xl transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
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
