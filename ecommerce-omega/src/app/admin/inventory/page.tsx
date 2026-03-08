"use client";

import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import { PackageSearch, Search, AlertTriangle, Save, RefreshCcw, AlertCircle } from "lucide-react";

type InventoryItem = {
  id: string;
  title: string;
  sku: string;
  stock: number;
  imageUrl: string;
  mfg: string;
  active: boolean;
};

export default function AdminInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Track changes: id -> new stock value
  const [changes, setChanges] = useState<Record<string, number>>({});

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      setItems(data || []);
      setChanges({});
    } catch (error) {
      console.error(error);
      alert("Error cargando inventario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id: string, newStock: string) => {
    const val = parseInt(newStock, 10);
    if (isNaN(val) || val < 0) return;

    setChanges(prev => {
      const original = items.find(i => i.id === id)?.stock;
      if (original === val) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: val };
    });
  };

  const handleSaveBulk = async () => {
    const idsToUpdate = Object.keys(changes);
    if (idsToUpdate.length === 0) return;

    const payload = idsToUpdate.map(id => ({
      id,
      stock: changes[id]
    }));

    try {
      setSaving(true);
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload })
      });

      if (!res.ok) throw new Error("Error guardando el stock");

      // Update local state to reflect changes without a full refetch
      setItems(prevItems => prevItems.map(item => {
        if (changes[item.id] !== undefined) {
          return { ...item, stock: changes[item.id] };
        }
        return item;
      }));
      setChanges({});
      
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error guardando");
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingChangesCount = Object.keys(changes).length;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-0 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <PackageSearch className="w-8 h-8 text-blue-600" />
            Control de Inventario
          </h1>
          <p className="text-sm text-gray-500 mt-1">Ajuste rápido de unidades disponibles. Cambiá y guardá.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {pendingChangesCount > 0 && (
            <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 flex-shrink-0 animate-in fade-in">
              {pendingChangesCount} cambio{pendingChangesCount !== 1 ? 's' : ''} sin guardar
            </span>
          )}
          <button
            onClick={handleSaveBulk}
            disabled={pendingChangesCount === 0 || saving}
            className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-xl shadow-sm border border-gray-200 flex items-center justify-between border-b-0">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Quick Edit Table */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <RefreshCcw className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="font-medium">No se encontraron productos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Inventario Nuevo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map(item => {
                  const currentValue = changes[item.id] !== undefined ? changes[item.id] : item.stock;
                  const isModified = changes[item.id] !== undefined;
                  const isLowStock = currentValue === 0 || (!isModified && item.stock <= 5);

                  return (
                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${isModified ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                          <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                            <NextImage src={item.imageUrl} alt={item.title} fill className="object-cover" unoptimized />
                          </div>
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex-shrink-0"></div>
                          )}
                          <div>
                             <p className="font-semibold text-gray-900 truncate max-w-[250px]" title={item.title}>{item.title}</p>
                             <div className="flex items-center gap-2 mt-0.5">
                               {isLowStock && <AlertTriangle className="w-3 h-3 text-red-500" />}
                               <span className="text-xs text-gray-500">Actual: {item.stock}</span>
                             </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-600 font-mono text-xs">
                         {item.sku || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-center">
                         <span className={`inline-flex w-2 h-2 rounded-full ${item.active ? 'bg-green-500' : 'bg-red-400'}`} title={item.active ? 'Activo' : 'Pausado'} />
                      </td>
                      <td className="px-6 py-3 text-right">
                         <div className="flex items-center justify-end gap-2">
                           {isModified && <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider animate-in fade-in slide-in-from-right-2">Modificado</span>}
                           <input 
                             type="number"
                             min="0"
                             className={`w-24 px-3 py-1.5 border rounded-lg text-right font-bold text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                               isModified ? 'border-blue-400 bg-blue-50/50 text-blue-900' : 'border-gray-300 text-gray-900'
                             }`}
                             value={currentValue}
                             onChange={(e) => handleStockChange(item.id, e.target.value)}
                           />
                         </div>
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
