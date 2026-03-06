"use client";

import React, { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail";
import { Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const storedUser = localStorage.getItem("userLoggedIn");
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        const res = await fetch(`/api/user/orders?email=${encodeURIComponent(user.email)}`);

        if (res.ok) {
          const data = await res.json();
          // Map DB response to expected structure
          const formattedOrders = data.map((o: any) => ({
            id: o.id,
            date: o.created_at,
            total: o.total,
            status: o.status,
            items: o.items || [],
            shipping: o.shipping || {},
            paymentMethod: o.payment_method,
          }));
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error("Error loading orders", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-sm text-gray-500 font-medium">Cargando historial de compras...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 rounded-xl border shadow-sm" style={{ background: 'var(--surface, #ffffff)', borderColor: 'var(--border, #f3f4f6)' }}>
            <h3 className="text-xl font-medium mb-3" style={{ color: 'var(--color-primary-text)' }}>No hay compras registradas</h3>
            <p className="max-w-sm mx-auto text-sm" style={{ color: 'var(--color-secondary-text)' }}>Parece que aún no has comprado nada con nosotros, o estabas como invitado. ¡Anímate a explorar la tienda!</p>
          </div>
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
