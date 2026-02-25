"use client";

import React, { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";

type Order = {
  id: string;
  date: string;
  total: number;
  status: "pendiente" | "pagado" | "enviado"; 
  items: { id: string; title: string; price: number; quantity: number }[];
  shipping: {
    firstName: string; lastName: string; address: string; city: string;
    province: string; postalCode: string; phone: string;
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
          firstName: "Juan", lastName: "Pérez", address: "Av. Siempre Viva 742",
          city: "Córdoba", province: "Córdoba", postalCode: "5000",
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
          firstName: "Lucía", lastName: "González", address: "Calle Falsa 123",
          city: "Rosario", province: "Santa Fe", postalCode: "2000",
          phone: "+54 9 341 7654321",
        },
        paymentMethod: "transfer",
      },
      {
        id: "z9y8x7w6v5",
        date: "2025-04-30T16:00:00Z",
        total: 2150,
        status: "pendiente",
        items: [{ id: "prod020", title: "Gorra Bordada Negra", price: 2150, quantity: 1 }],
        shipping: {
          firstName: "Martín", lastName: "Ruiz", address: "Ruta 9 km 312",
          city: "Villa María", province: "Córdoba", postalCode: "5900",
          phone: "+54 9 353 4567890",
        },
        paymentMethod: "local",
      },
    ];

    setOrders(mockOrders);
  }, []);

  const statusColor = (s: Order["status"]): React.CSSProperties => {
    switch (s) {
      case "pendiente":
        return { color: "var(--accent-warning, #ca8a04)" }; 
      case "pagado":
        return { color: "var(--accent-info, #2563eb)" };     
      case "enviado":
        return { color: "var(--accent-purple, #7c3aed)" };   
      default:
        return { color: "var(--accent-success, #16a34a)" };  
    }
  };

  return (
    <div
      className="min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)]"
      style={{ background: "var(--bgweb)", color: "var(--color-primary-text)" }}
    >
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2
          className="text-3xl font-bold mb-6"
          style={{ color: "var(--color-primary-text)" }}
        >
          Mis Compras
        </h2>

        {orders.length === 0 ? (
          <p style={{ color: "var(--color-secondary-text)" }}>
            No realizaste compras aún.
          </p>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl shadow-sm hover:shadow-md transition cursor-pointer p-5 border"
                onClick={() => setSelectedOrder(order)}
                style={{
                  background: "var(--surface, #ffffff)",
                  borderColor: "var(--border, #e5e7eb)",         // ≈ gray-200
                }}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <p className="text-sm" style={{ color: "var(--color-primary-text)" }}>
                      Orden{" "}
                      <span className="font-semibold" style={{ color: "var(--color-primary-text)"}}>
                        #{order.id.slice(0, 6)}...
                      </span>
                    </p>
                    <p className="text-sm" style={{ color: "var(--color-secondary-text)" }}>
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <p className="text-sm" style={{ color: "var(--color-primary-text)" }}>
                      Estado:{" "}
                      <span className="font-semibold capitalize" style={statusColor(order.status)}>
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm" style={{ color: "var(--color-primary-text)" }}>
                      Total:{" "}
                      <span className="font-bold" style={{ color: "var(--color-primary-text)" }}>
                        ${order.total.toFixed(2)}
                      </span>
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
