"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ShippingRates } from "@/app/api/admin/shipping/route";

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
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 hover:text-gray-900 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          <Link href="/admin">Volver al Dashboard</Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Tarifas de Envío
        </h1>
        <p className="text-gray-500 mt-2">
          Configurá los precios de entrega dependiendo de la provincia. Estas tarifas se le aplicarán como un cargo extra al total del carrito al momento del checkout.
        </p>
      </div>

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
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50"
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
                            className="w-32 pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm font-medium"
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
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                    className="w-full border border-gray-300 rounded-md py-2 pl-7 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
