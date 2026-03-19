"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Truck, Package, MapPin, Phone, MessageCircle, CheckCheck, Search } from "lucide-react";
import Link from "next/link";
import { ShippingRates } from "@/app/api/admin/shipping/route";

type OrderItem = { quantity: number; title: string; price: number; color?: string };

type Order = {
  id: string;
  total: number | string;
  status: string;
  created_at?: string;
  createdAt?: string;
  paymentMethod?: string;
  payment_method?: string;
  reference?: string;
  receipt_url?: string;
  shipping?: {
    firstName?: string;
    lastName?: string;
    city?: string;
    province?: string;
    address?: string;
    floorApt?: string;
    postalCode?: string;
    phone?: string;
    dni?: string;
  };
  items?: OrderItem[];
};

function OrdersToShip() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"pendientes" | "enviadas">("pendientes");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(r => r.json())
      .then((data: Order[]) => {
        if (!Array.isArray(data)) return;
        // Transfer pagado/enviado + mercadopago pagado/enviado
        const toShip = data.filter(o => {
          const pm = (o.paymentMethod || o.payment_method || "").toLowerCase();
          const isReadyPayment = pm === "transfer" || pm === "mercadopago" || pm === "mercado pago";
          return isReadyPayment && (o.status === "pagado" || o.status === "enviado");
        });
        setOrders(toShip);
      })
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, []);

  const markShipped = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: "enviado" }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "enviado" } : o));
      } else {
        alert("Error al actualizar la orden.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const toNum = (v: number | string) => typeof v === "number" ? v : parseFloat(v || "0");

  const pmLabel = (o: Order) => {
    const pm = (o.paymentMethod || o.payment_method || "").toLowerCase();
    if (pm === "transfer") return { label: "Transferencia", color: "bg-gray-100 text-theme-secondary" };
    if (pm.includes("mercado")) return { label: "MercadoPago", color: "bg-sky-100 text-sky-800" };
    return { label: pm || "—", color: "bg-gray-100 text-gray-700" };
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === "pendientes" && o.status !== "pagado") return false;
    if (activeTab === "enviadas" && o.status !== "enviado") return false;

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      const idMatch = o.id.toLowerCase().includes(q);
      const nameMatch = `${o.shipping?.firstName || ""} ${o.shipping?.lastName || ""}`.toLowerCase().includes(q);
      const cityMatch = (o.shipping?.city || "").toLowerCase().includes(q);
      const dniMatch = (o.shipping?.dni || "").toLowerCase().includes(q);
      
      if (!idMatch && !nameMatch && !cityMatch && !dniMatch) return false;
    }

    return true;
  });

  const pendientesCount = orders.filter(o => o.status === "pagado").length;
  const enviadasCount = orders.filter(o => o.status === "enviado").length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-indigo-50/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">Despacho de Órdenes</h2>
            <p className="text-sm text-gray-500">
              Pagos aprobados listos para enviar y órdenes ya despachadas.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID, ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="flex px-4 border-b border-gray-100 pt-2 bg-gray-50/30">
        <button
          onClick={() => setActiveTab("pendientes")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "pendientes" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Para Despachar
          <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "pendientes" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
            {pendientesCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("enviadas")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "enviadas" ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Ya Enviadas
          <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "enviadas" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
            {enviadasCount}
          </span>
        </button>
      </div>

      {loadingOrders ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <CheckCheck className="w-10 h-10 mb-3 text-green-400" />
          <p className="font-medium text-gray-600">No hay órdenes aquí</p>
          <p className="text-sm mt-1">Intenta con otra pestaña o cambia la búsqueda.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {filteredOrders.map(order => {
            const pm = pmLabel(order);
            const isExpanded = expandedId === order.id;
            const date = order.created_at || order.createdAt;

            return (
              <li key={order.id} className="hover:bg-gray-50 transition-colors">
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Left: Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm text-gray-500 font-medium">#{order.id.slice(0, 8)}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pm.color}`}>{pm.label}</span>
                      {order.status === "enviado" && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Enviada</span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {order.shipping?.firstName} {order.shipping?.lastName}
                    </p>
                    {order.shipping?.city && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {order.shipping.city}, {order.shipping.province}
                      </p>
                    )}
                    {date && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(date).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>

                  {/* Center: Total */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-gray-900">
                      ${toNum(order.total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-400">{order.items?.length ?? 0} producto(s)</p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="text-xs text-theme-primary hover:underline font-medium px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      {isExpanded ? "Ocultar" : "Ver detalles"}
                    </button>
                    {order.status !== "enviado" && (
                      <button
                        onClick={() => markShipped(order.id)}
                        disabled={updatingId === order.id}
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-sm transition disabled:opacity-50"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                        Marcar Enviada
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 bg-gray-50/70 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {/* Products */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4 text-gray-400" /> Productos
                        </h4>
                        <ul className="space-y-2">
                          {(order.items || []).map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm text-gray-700">
                              <span>
                                <span className="font-semibold text-theme-secondary">{item.quantity}x</span>{" "}
                                {item.title}
                                {item.color && <span className="text-xs text-gray-400 ml-1">({item.color})</span>}
                              </span>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between font-bold text-gray-900 text-sm">
                          <span>Total</span>
                          <span>${toNum(order.total).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      {/* Shipping & Contact */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" /> Datos de Envío
                        </h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><span className="text-gray-400 text-xs uppercase tracking-wide block">Cliente</span>
                            <span className="font-medium">{order.shipping?.firstName} {order.shipping?.lastName}</span>
                            {order.shipping?.dni && <span className="text-gray-500"> — DNI {order.shipping.dni}</span>}
                          </p>
                          <p><span className="text-gray-400 text-xs uppercase tracking-wide block">Dirección</span>
                            {order.shipping?.address} {order.shipping?.floorApt && `(Depto: ${order.shipping.floorApt})`}
                          </p>
                          <p>{order.shipping?.city}, {order.shipping?.province} ({order.shipping?.postalCode})</p>
                          {order.shipping?.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {order.shipping.phone}
                              <a
                                href={`https://wa.me/${order.shipping.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full hover:bg-green-100 transition"
                              >
                                <MessageCircle className="w-3 h-3" /> WhatsApp
                              </a>
                            </p>
                          )}
                          {order.reference && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <span className="text-gray-400 text-xs uppercase tracking-wide block mb-1">Ref. Transferencia</span>
                              <span className="font-mono text-xs bg-gray-50 text-blue-900 px-2 py-1 rounded border border-blue-100 break-all block">
                                {order.reference}
                              </span>
                            </div>
                          )}
                          {order.receipt_url && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <span className="text-gray-400 text-xs uppercase tracking-wide block mb-1">Comprobante</span>
                              {order.receipt_url.includes('supabase') || order.receipt_url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                                <a href={order.receipt_url} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={order.receipt_url}
                                    alt="Comprobante"
                                    className="max-h-36 rounded-lg border border-gray-200 object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity mt-1"
                                  />
                                </a>
                              ) : (
                                <a
                                  href={order.receipt_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-theme-primary font-medium underline"
                                >
                                  Ver comprobante
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function ShippingAdminPage() {
  const [rates, setRates] = useState<ShippingRates>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // New Zone Form
  const [newZoneName, setNewZoneName] = useState("");
  const [newZonePrice, setNewZonePrice] = useState("");

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/shipping");
      if (!res.ok) throw new Error("Error al obtener las tarifas desde el servidor.");
      const data = await res.json();
      setRates(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error cargando tarifas");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (province: string, newPriceStr: string) => {
    // Allows empty string temporarily while typing, but generally expects numbers
    const price = newPriceStr === "" ? 0 : parseFloat(newPriceStr);
    
    setRates((prev) => ({
      ...prev,
      [province]: price,
    }));
    setSuccess(false); // Reset success state if edited
  };

  const handleRemoveZone = (province: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la tarifa de envío para "${province}"? Esto podría afectar carritos activos.`)) {
      return;
    }
    
    const newRates = { ...rates };
    delete newRates[province];
    setRates(newRates);
    setSuccess(false);
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim() || newZonePrice === "") return;
    
    const price = parseFloat(newZonePrice);
    if (isNaN(price) || price < 0) {
      alert("Por favor, ingresa un precio válido");
      return;
    }

    if (rates[newZoneName.trim()]) {
      alert("Esta provincia ya tiene una tarifa asignada.");
      return;
    }

    setRates((prev) => ({
      ...prev,
      [newZoneName.trim()]: price,
    }));
    
    setNewZoneName("");
    setNewZonePrice("");
    setSuccess(false);
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const res = await fetch("/api/admin/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rates),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar los cambios.");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success after 3s

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary-bg)" }} />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Cargando tarifas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 hover:text-gray-900 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            <Link href="/admin">Volver al Dashboard</Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 tracking-tight text-gray-900">
            Envíos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestioná las órdenes pendientes de despacho y configurá los precios de envío por provincia.
          </p>
        </div>
      </div>

      {/* Orders to ship */}
      <OrdersToShip />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border text-gray-900 border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-semibold">Provincias Activas ({Object.keys(rates).length})</h2>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="flex items-center gap-2 bg-theme-primary text-theme-primary-text px-4 py-2 rounded-lg font-medium text-sm hover:bg-theme-secondary transition disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Cambios
              </button>
            </div>

            {success ? (
               <div className="p-4 bg-green-50 border-b border-green-100 flex items-center justify-center gap-2 text-green-700 animate-in fade-in zoom-in duration-300">
                 <CheckCircle2 className="w-5 h-5" />
                 <span className="font-semibold text-sm">¡Tarifas actualizadas correctamente en la web!</span>
               </div>
            ) : null}

            <div className="p-0">
              {Object.keys(rates).length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No hay tarifas de envío configuradas. Agregá tu primera provincia.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {Object.entries(rates).map(([province, price]) => (
                    <li key={province} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{province}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => handlePriceChange(province, e.target.value)}
                            className="w-32 pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-theme-primary focus:border-theme-primary outline-none transition text-sm font-medium"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveZone(province)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title={`Eliminar ${province}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column: Add New Zone */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddZone} className="bg-white border text-gray-900 border-gray-200 rounded-xl p-5 shadow-sm sticky top-6">
            <h3 className="text-sm uppercase tracking-wider font-bold text-gray-500 mb-4 pb-2 border-b border-gray-100">
              Añadir nueva provincia
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Provincia / Zona
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Neuquén..."
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-theme-primary focus:border-theme-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo de Envío ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newZonePrice}
                    onChange={(e) => setNewZonePrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 pl-7 pr-3 text-sm focus:ring-2 focus:ring-theme-primary focus:border-theme-primary outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Añadir a la lista
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
