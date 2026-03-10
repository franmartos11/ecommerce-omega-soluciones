"use client";

import React, { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail";
import ProfileContent from "./ProfileContent";
import { Loader2, Package, User as UserIcon, LogOut, ChevronRight, Truck, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";
import { toast } from "react-hot-toast";

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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Si terminó de cargar auth y no hay user, redirigir
    if (!authLoading && !user) {
      router.push("/LogIn");
      return;
    }

    async function loadOrders() {
      if (!user?.email) return;

      try {
        const res = await fetch(`/api/user/orders?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          type RawOrder = { id: string; created_at: string; total: number; status: string; items?: unknown[]; shipping?: unknown; paymentMethod?: string; payment_method?: string };
          const formattedOrders = data.map((o: RawOrder) => ({
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
        setLoadingOrders(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    localStorage.removeItem("userLoggedIn");
    toast.success("Sesión cerrada correctamente");
    router.push("/");
  };

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

  const StatusIcon = ({ status }: { status: Order["status"] }) => {
    if (status === "pendiente") return <Clock className="w-5 h-5" style={{ color: "var(--color-primary-bg)" }} />;
    if (status === "pagado") return <CheckCircle className="w-5 h-5" style={{ color: "var(--color-primary-bg)" }} />;
    if (status === "enviado") return <Truck className="w-5 h-5" style={{ color: "var(--color-primary-bg)" }} />;
    return <CheckCircle className="w-5 h-5" style={{ color: "var(--color-primary-bg)" }} />;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--color-primary-bg)" }} />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Cargando tu historial...</p>
      </div>
    );
  }

  if (!user) return null; // Será redirigido por el useEffect

  return (
    <div
      className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]"
      style={{ background: "var(--bgweb)", color: "var(--color-primary-text)" }}
    >
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header del Dashboard */}
        <div className="mb-8 border-b pb-6" style={{ borderColor: 'var(--border, #e5e7eb)' }}>
          <h1 className="text-3xl font-bold tracking-tight">Mi Panel</h1>
          <p className="text-sm mt-2" style={{ color: "var(--color-secondary-text)" }}>
            Gestioná tus compras y tu perfil desde aquí. Has iniciado sesión como <span className="font-semibold">{user.email}</span>.
          </p>
        </div>

        <div className="flex justify-between gap-8 h-full"> 
          
          {/* SIDEBAR LATERAL */}
          <aside className="w-[100%] md:w-64 flex-shrink-0 space-y-1 block max-md:mb-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "orders" ? "shadow-sm" : "hover:bg-gray-50/50"}`}
              style={{
                background: activeTab === "orders" ? "var(--surface, #ffffff)" : "transparent",
                color: activeTab === "orders" ? "var(--color-primary-bg)" : "var(--color-secondary-text)",
                borderColor: activeTab === "orders" ? "var(--border, #e5e7eb)" : "transparent",
                borderWidth: activeTab === "orders" ? "1px" : "0px",
              }}
            >
              <Package className="w-5 h-5" />
              Mis Compras
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "profile" ? "shadow-sm" : "hover:bg-gray-50/50"}`}
              style={{
                background: activeTab === "profile" ? "var(--surface, #ffffff)" : "transparent",
                color: activeTab === "profile" ? "var(--color-primary-bg)" : "var(--color-secondary-text)",
                borderColor: activeTab === "profile" ? "var(--border, #e5e7eb)" : "transparent",
                borderWidth: activeTab === "profile" ? "1px" : "0px",
              }}
            >
              <UserIcon className="w-5 h-5" />
              Mi Perfil
            </button>

            <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--border, #e5e7eb)' }}>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                style={{ color: "var(--color-danger, #ef4444)" }}
              >
                {loggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                Cerrar Sesión
              </button>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL */}
          <section className="flex-1 min-w-0">
            
            {activeTab === "profile" && <ProfileContent user={user} />}

            {activeTab === "orders" && (
              <>
                {loadingOrders ? (
                  <div className="flex flex-col items-center justify-center py-24 rounded-2xl border shadow-sm" style={{ background: "var(--surface, #ffffff)", borderColor: "var(--border, #e5e7eb)" }}>
                    <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: "var(--color-primary-bg)" }} />
                    <p className="text-sm font-medium" style={{ color: "var(--color-secondary-text)" }}>Cargando tu historial...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-24 rounded-2xl border shadow-sm" style={{ background: 'var(--surface, #ffffff)', borderColor: 'var(--border, #e5e7eb)' }}>
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Aún no hay compras</h3>
                    <p className="max-w-xs mx-auto text-sm" style={{ color: 'var(--color-secondary-text)' }}>
                      ¿Qué estás esperando? Descubre nuestros increíbles productos navegando por la tienda.
                    </p>
                    <button onClick={() => router.push('/')} className="mt-6 px-6 py-2.5 rounded-full text-sm font-medium transition-transform hover:scale-105" style={{ background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)" }}>
                      Ir a la tienda
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer"
                        style={{
                          background: "var(--surface, #ffffff)",
                          borderColor: "var(--border, #e5e7eb)",
                        }}
                      >
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <div className="p-3 rounded-full border border-gray-100 transition-colors" style={{ background: "var(--color-secondary-bg)" }}>
                            <StatusIcon status={order.status} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">
                              Orden #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--color-secondary-text)" }}>
                              {new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 border-t sm:border-t-0 pt-4 sm:pt-0" style={{ borderColor: 'var(--border, #e5e7eb)' }}>
                          <div className="text-left sm:text-right">
                            <p className="text-xs uppercase tracking-wider font-semibold mb-0.5" style={statusColor(order.status)}>
                              {order.status}
                            </p>
                            <p className="text-base font-bold">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full transition-colors" style={{ background: "var(--color-secondary-bg)", color: "var(--color-primary-bg)" }}>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </section>
        </div>

        {selectedOrder && (
          <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </main>

      <Footer />
    </div>
  );
}
