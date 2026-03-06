"use client";

import Link from "next/link";
import { ShoppingBag, Settings, Tag, MessageSquare, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const cards = [
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
      title: "Reseñas",
      description: "Revisa los comentarios de tus clientes.",
      icon: <MessageSquare className="w-6 h-6 text-orange-600" />,
      href: "/admin/reviews",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-6">
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bienvenido al Panel de Administración</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl">
          Desde aquí puedes gestionar todos los aspectos de Omega. Selecciona una sección para empezar a revisar tus pedidos, actualizar tu catálogo o cambiar el aspecto de la tienda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <Link 
            key={i} 
            href={card.href} 
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-md hover:border-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              {card.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                {card.title}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h2>
              <p className="text-gray-500 text-sm mt-1">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
