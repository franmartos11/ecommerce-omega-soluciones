import React, { useState, useEffect } from "react";
import { Loader2, Plus, X } from "lucide-react";

export type Badge = { text: string; color: string };

export function BadgesEditor() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Formulario nuevo
  const [newText, setNewText] = useState("");
  const [newColor, setNewColor] = useState("bg-red-500 text-white");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        const badgeSetting = data.find((s: any) => s.key === "product_badges");
        if (badgeSetting && badgeSetting.value) {
           setBadges(Array.isArray(badgeSetting.value) ? badgeSetting.value : []);
        }
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBadges = async (updatedBadges: Badge[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "product_badges", value: updatedBadges }),
      });

      if (!res.ok) throw new Error("Failed to save badges");

      setBadges(updatedBadges);
    } catch (error: any) {
      alert(`Hubo un error al guardar etiquetas: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    const newBadge = { text: newText.trim(), color: newColor };
    const arr = [...badges, newBadge];
    handleSaveBadges(arr);
    setNewText("");
  };

  const handleRemove = (index: number) => {
    if(!confirm("¿Borrar esta etiqueta global?")) return;
    const arr = badges.filter((_, i) => i !== index);
    handleSaveBadges(arr);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const colorOptions = [
    { label: "Rojo", val: "bg-red-500 text-white" },
    { label: "Azul", val: "bg-blue-500 text-white" },
    { label: "Verde", val: "bg-green-500 text-white" },
    { label: "Amar.', Negro", val: "bg-yellow-400 text-black" },
    { label: "Negro", val: "bg-black text-white" },
    { label: "Púrpura", val: "bg-purple-500 text-white" },
    { label: "Naranja", val: "bg-orange-400 text-white" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
           Etiquetas Globales (Badges)
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Crea etiquetas reutilizables (ej: Oferta Especial, Cyber Monday) para asignarlas a grupos de productos desde su panel de control.
        </p>
      </div>

      <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:flex-1">
           <label className="block text-sm font-medium text-gray-700 mb-1">Texto de la Etiqueta</label>
           <input 
             type="text" 
             placeholder="Ej: Hot Sale 2x1"
             className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-blue-500 text-sm"
             value={newText}
             onChange={e => setNewText(e.target.value)}
           />
        </div>
        <div className="w-full sm:w-48">
           <label className="block text-sm font-medium text-gray-700 mb-1">Color Base</label>
           <select 
             className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
             value={newColor}
             onChange={e => setNewColor(e.target.value)}
           >
             {colorOptions.map(c => <option key={c.val} value={c.val}>{c.label}</option>)}
           </select>
        </div>
        <button 
          onClick={handleAdd}
          disabled={!newText.trim() || isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Crear
        </button>
      </div>

      <div className="space-y-3 mt-6">
        {badges.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No has creado ninguna etiqueta todavía.</p>
        ) : (
          badges.map((b, i) => (
            <div key={i} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full tracking-wide ${b.color}`}>
                  {b.text}
                </span>
                <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">{b.color}</span>
              </div>
              <button
                onClick={() => handleRemove(i)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded"
                title="Eliminar Etiqueta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
