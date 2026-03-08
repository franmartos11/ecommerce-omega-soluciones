"use client";

import React, { useEffect, useState } from "react";
import { Ticket, Plus, Trash2, Users, RefreshCcw, Tag } from "lucide-react";

type Coupon = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  times_used: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

export default function AdminMarketing() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data || []);
    } catch (error) {
      console.error(error);
      alert("Error cargando cupones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discount_type: type,
          discount_value: value,
          max_uses: maxUses ? parseInt(maxUses) : null,
          expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creando cupón");
      }

      await fetchCoupons();
      setIsFormOpen(false);
      
      // Reset form
      setCode("");
      setValue("");
      setMaxUses("");
      setExpiresAt("");
      
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cupón permanentemente?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Error al eliminar.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-0 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Ticket className="w-8 h-8 text-blue-600" />
            Marketing y Promociones
          </h1>
          <p className="text-sm text-gray-500 mt-1">Crea cupones de descuento y campañas.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition"
        >
          {isFormOpen ? "Cancelar" : <><Plus className="w-4 h-4" /> Nuevo Cupón</>}
        </button>
      </div>

      {/* New Coupon Form */}
      {isFormOpen && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Crear Nuevo Cupón</h2>
          
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código (Ej: VERANO20)</label>
              <input 
                required 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 uppercase font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="PROMO2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Descuento</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor del Descuento {type === "percentage" ? "(%)" : "($)"}
              </label>
              <input 
                required 
                type="number" 
                min="1"
                step={type === "percentage" ? "1" : "0.01"}
                value={value} 
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={type === "percentage" ? "Ej: 15" : "Ej: 1500"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usos Máximos (Opcional)</label>
              <input 
                type="number" 
                min="1"
                value={maxUses} 
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Dejar en blanco para usos ilimitados"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento (Opcional)</label>
              <input 
                type="datetime-local" 
                value={expiresAt} 
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t flex justify-end">
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Guardar Cupón
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <RefreshCcw className="w-8 h-8 animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Tag className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Sin Cupones</h3>
            <p className="text-gray-500 text-sm mt-1">Gané clientes ofreciendo descuentos rápidos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4 text-center">Descuento</th>
                  <th className="px-6 py-4 text-center">Usos</th>
                  <th className="px-6 py-4 text-center">Vencimiento</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((c) => {
                  const isExpired = c.expires_at && new Date(c.expires_at) < new Date();
                  const isDepleted = c.max_uses !== null && c.times_used >= c.max_uses;
                  const inactive = isExpired || isDepleted || !c.is_active;

                  return (
                    <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${inactive ? 'opacity-60 bg-gray-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-gray-900 text-base">{c.code}</div>
                        {inactive && <span className="text-[10px] uppercase font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded mt-1 inline-block">Inactivo</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                          {c.discount_type === "percentage" ? `${c.discount_value}%` : `$${c.discount_value}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{c.times_used}</span>
                          <span className="text-gray-400 mx-0.5">/</span>
                          <span className="text-gray-400">{c.max_uses || "∞"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">
                        {c.expires_at ? (
                          <div className="flex flex-col items-center justify-center">
                             <span>{new Date(c.expires_at).toLocaleDateString("es-AR")}</span>
                             <span className="text-xs">{new Date(c.expires_at).toLocaleTimeString("es-AR", {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        ) : (
                          <span className="italic">Sin límite</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(c.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-block"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
