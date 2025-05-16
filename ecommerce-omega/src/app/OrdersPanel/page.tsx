"use client";

import React, { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail";
import Navbar from "../Components/NavigationBar/NavBar";
import Footer from "../Components/Footer/Footer";

type Order = {
  id: string;
  date: string;
  total: number;
  status: "pendiente" | "pagado" | "enviado" | "enviado";
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: "mercadopago" | "local" | "transfer";
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "a1b2c3d4e5",
        date: "2025-05-14T13:45:00Z",
        total: 12345.67,
        status: "pagado",
        items: [
          { id: "prod001", title: "Zapatillas Urbanas", price: 4500, quantity: 2 },
          { id: "prod002", title: "Campera Impermeable", price: 3350, quantity: 1 },
        ],
        shipping: {
          firstName: "Juan",
          lastName: "Pérez",
          address: "Av. Siempre Viva 742",
          city: "Córdoba",
          province: "Córdoba",
          postalCode: "5000",
          phone: "+54 9 351 1234567",
        },
        paymentMethod: "mercadopago",
      },
      {
        id: "f6g7h8i9j0",
        date: "2025-05-10T09:20:00Z",
        total: 7890,
        status: "enviado",
        items: [
          { id: "prod010", title: "Remera básica blanca", price: 1500, quantity: 2 },
          { id: "prod011", title: "Jeans Azul Slim", price: 4890, quantity: 1 },
        ],
        shipping: {
          firstName: "Lucía",
          lastName: "González",
          address: "Calle Falsa 123",
          city: "Rosario",
          province: "Santa Fe",
          postalCode: "2000",
          phone: "+54 9 341 7654321",
        },
        paymentMethod: "transfer",
      },
      {
        id: "z9y8x7w6v5",
        date: "2025-04-30T16:00:00Z",
        total: 2150,
        status: "pendiente",
        items: [
          { id: "prod020", title: "Gorra Bordada Negra", price: 2150, quantity: 1 },
        ],
        shipping: {
          firstName: "Martín",
          lastName: "Ruiz",
          address: "Ruta 9 km 312",
          city: "Villa María",
          province: "Córdoba",
          postalCode: "5900",
          phone: "+54 9 353 4567890",
        },
        paymentMethod: "local",
      },
    ];

    setOrders(mockOrders);
  }, []);

  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Mis Compras</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No realizaste compras aún.</p>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer p-5"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Orden <span className="font-semibold text-gray-700">#{order.id.slice(0, 6)}...</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <p className="text-sm">
                      Estado:{" "}
                      <span
                        className={`font-semibold capitalize ${
                          order.status === "pendiente"
                            ? "text-yellow-600"
                            : order.status === "pagado"
                            ? "text-blue-600"
                            : order.status === "enviado"
                            ? "text-purple-600"
                            : "text-green-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Total: <span className="font-bold">${order.total.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </main>

      <Footer />
    </div>
  );
}
