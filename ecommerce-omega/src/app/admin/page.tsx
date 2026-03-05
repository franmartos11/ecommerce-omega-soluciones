"use client";

import { useEffect, useState, useRef } from "react";
import { Save, Loader2, AlertCircle, CheckCircle2, Plus, X, Image as ImageIcon, Layout, MoveUp, MoveDown } from "lucide-react";
import type { Config } from "@/lib/config.types";
import { supabase } from "@/app/lib/supabase/client";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("theme");
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Raw JSON state for the advanced editor
  const [rawJson, setRawJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/config");
      const data = await res.json();
      setConfig(data);
      setRawJson(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to load config", e);
      setMessage({ type: "error", text: "Error al cargar la configuración." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    setMessage(null);

    let payload = config;

    // If we are on the advanced tab, we must save the raw JSON state
    if (activeTab === "advanced") {
      try {
        payload = JSON.parse(rawJson);
        setJsonError(null);
      } catch (err: any) {
        setJsonError(err.message);
        setIsSaving(false);
        setMessage({ type: "error", text: "El JSON tiene errores de sintaxis." });
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      
      const result = await res.json();
      setMessage({ type: "success", text: "¡Configuración guardada exitosamente!" });
      
      // Update local state to reflect what we just saved
      setConfig(payload);
      setRawJson(JSON.stringify(payload, null, 2));

      // Auto-hide success message
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      console.error("Save error", e);
      setMessage({ type: "error", text: "Ocurrió un error al guardar." });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper nested state updater
  const updateConfig = (path: string[], value: any) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
      
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      
      return newData;
    });
  };

  if (isLoading || !config) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General" },
    { id: "theme", label: "Tema y Colores" },
    { id: "banners", label: "Banners (Inicio)" },
    { id: "badges", label: "Etiquetas Gbl." },
    { id: "contact", label: "Contacto y Soporte" },
    { id: "advanced", label: "Avanzado (JSON)" },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración de la Tienda</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los colores, información de contacto y detalles generales.
          </p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white text-sm font-medium rounded-lg shadow-sm transition-colors w-full sm:w-auto"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar Cambios
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-8 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              // Sync rawJson back if we leave advanced tab to avoid losing raw edits
              if (activeTab === "advanced" && !jsonError) {
                 try { setConfig(JSON.parse(rawJson)); } catch(e) {}
              }
              // Sync rawJson if we enter advanced tab
              if (tab.id === "advanced") {
                 setRawJson(JSON.stringify(config, null, 2));
              }
              setActiveTab(tab.id);
            }}
            className={`whitespace-nowrap py-3 px-5 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        
        {/* --- GENERAL TAB --- */}
        {activeTab === "general" && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Información del Sitio</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Sitio</label>
                <input 
                  type="text" 
                  value={config.sitio?.nombre || ""} 
                  onChange={(e) => updateConfig(["sitio", "nombre"], e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dominio</label>
                <input 
                  type="text" 
                  value={config.sitio?.dominio || ""} 
                  onChange={(e) => updateConfig(["sitio", "dominio"], e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="https://www.midominio.com"
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mt-8">SEO (Buscadores)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título SEO</label>
                <input 
                  type="text" 
                  value={config.SEO?.titulo || ""} 
                  onChange={(e) => updateConfig(["SEO", "titulo"], e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
                <textarea 
                  value={config.SEO?.descripcion || ""} 
                  onChange={(e) => updateConfig(["SEO", "descripcion"], e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- THEME TAB --- */}
        {activeTab === "theme" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Colores de la Tienda</h2>
              <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                Usa el selector para elegir los colores primarios. Estos afectarán botones, bordes y el fondo de la web.
              </p>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ColorInput 
                  label="Color Primario" 
                  subtitle="Botones principales e iconos"
                  value={config.Colores?.vars?.["--color-primary-bg"] || "#000000"} 
                  onChange={(hex) => updateConfig(["Colores", "vars", "--color-primary-bg"], hex)} 
                />
                
                <ColorInput 
                  label="Color Secundario" 
                  subtitle="Efectos hover en botones"
                  value={config.Colores?.vars?.["--color-secondary-bg"] || "#000000"} 
                  onChange={(hex) => updateConfig(["Colores", "vars", "--color-secondary-bg"], hex)} 
                />

                <ColorInput 
                  label="Fondo Web (Background)" 
                  subtitle="Fondo general de las páginas"
                  value={config.Colores?.vars?.["--bgweb"] || "#ffffff"} 
                  onChange={(hex) => updateConfig(["Colores", "vars", "--bgweb"], hex)} 
                />

                <ColorInput 
                  label="Color Texto Principal" 
                  subtitle="Títulos y texto general"
                  value={config.Colores?.vars?.["--color-primary-text"] || "#111827"} 
                  onChange={(hex) => updateConfig(["Colores", "vars", "--color-primary-text"], hex)} 
                />

                <ColorInput 
                  label="Bordes Primarios" 
                  subtitle="Bordes de cards y modales"
                  value={config.Colores?.vars?.["--color-primary-border"] || "#e5e7eb"} 
                  onChange={(hex) => updateConfig(["Colores", "vars", "--color-primary-border"], hex)} 
                />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Al guardar, si abres tu tienda en otra pestaña, verás que Hot-Reload aplicará los colores instantáneamente sin necesidad de reiniciar el servidor local.
              </p>
            </div>
          </div>
        )}

        {/* --- BANNERS TAB --- */}
        {activeTab === "banners" && (
          <BannersEditor />
        )}

        {/* --- BADGES TAB --- */}
        {activeTab === "badges" && (
          <BadgesEditor />
        )}

        {/* --- CONTACT TAB --- */}
        {activeTab === "contact" && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Datos de Soporte</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp de Ventas</label>
                <input 
                  type="text" 
                  value={(config.Soporte as any)?.tel || config.NumTelefonoSoporte || ""} 
                  onChange={(e) => {
                     updateConfig(["Soporte", "tel"], e.target.value);
                     updateConfig(["NumTelefonoSoporte"], e.target.value);
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="+54 9 351 000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Principal</label>
                <input 
                  type="email" 
                  value={(config.Soporte as any)?.email || ""} 
                  onChange={(e) => updateConfig(["Soporte", "email"], e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="hola@midominio.com"
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mt-8">Redes Sociales</h2>
            <div className="space-y-4">
              {['Instagram', 'Facebook', 'LinkedIn'].map((red) => (
                <div key={red} className="flex items-center gap-4">
                  <label className="w-24 text-sm font-medium text-gray-700">{red}</label>
                  <input 
                    type="text" 
                    value={config.Redes?.[red] || ""} 
                    onChange={(e) => updateConfig(["Redes", red], e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder={`https://www.${red.toLowerCase()}.com/tu-usuario`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ADVANCED (JSON) TAB --- */}
        {activeTab === "advanced" && (
          <div className="flex flex-col h-[600px]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Editor Avanzado de JSON</h2>
                <p className="text-sm text-gray-500">
                  Edita directamente la estructura cruda (Banners, Productos, Categorías). Ten cuidado con la sintaxis.
                </p>
              </div>
              {jsonError && (
                <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  Sintaxis inválida
                </span>
              )}
            </div>
            
            <textarea
              value={rawJson}
              onChange={(e) => {
                setRawJson(e.target.value);
                try {
                  JSON.parse(e.target.value);
                  setJsonError(null);
                } catch (err: any) {
                  setJsonError(err.message);
                }
              }}
              className={`flex-1 w-full p-4 font-mono text-sm rounded-xl border-2 outline-none transition-colors resize-none ${
                jsonError ? "border-red-400 bg-red-50/10 focus:border-red-500" : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:bg-white"
              }`}
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Color Input component
function ColorInput({ label, subtitle, value, onChange }: { label: string, subtitle: string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-sm">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold text-gray-900">{label}</label>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <div 
          className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-inner flex-shrink-0"
          style={{ backgroundColor: value }}
        />
      </div>
      
      <div className="flex relative">
        <input 
          type="color" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute opacity-0 w-full h-full cursor-pointer inset-0"
        />
        <div className="w-full flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
          <span className="text-gray-400 font-mono text-xs">HEX</span>
          <span className="font-mono text-sm tracking-wide text-gray-800 uppercase flex-1 text-center">{value}</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: Banners Editor
// ==========================================
function BannersEditor() {
  const [heroBanners, setHeroBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        const heroSetting = data.find((s: any) => s.key === "hero_banners");
        if (heroSetting && heroSetting.value) {
          setHeroBanners(Array.isArray(heroSetting.value) ? heroSetting.value : []);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBanners = async () => {
    setIsSaving(true);
    try {
      let finalBanners = [...heroBanners];

      if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `banner_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${fileName}`;
          const { error } = await supabase.storage.from('products').upload(filePath, file);
          if (error) throw new Error(`Upload failed for ${file.name}`);
          const { data } = supabase.storage.from('products').getPublicUrl(filePath);
          return data.publicUrl;
        });
        const uploadedUrls = await Promise.all(uploadPromises);
        finalBanners = [...finalBanners, ...uploadedUrls];
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_banners", value: finalBanners }),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      alert("Banners guardados correctamente.");
      setHeroBanners(finalBanners);
      setFilesToUpload([]);
    } catch (error: any) {
      alert(`Hubo un error al guardar banners: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Layout className="w-5 h-5 text-gray-500" />
            Carrusel Principal (Inicio)
          </h2>
          <p className="text-sm text-gray-500 mt-1">Sube imágenes en formato 16:4 para el banner promocional superior de la tienda.</p>
        </div>
        <button
          onClick={handleSaveBanners}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar Banners
        </button>
      </div>

      <div className="space-y-4">
        {heroBanners.map((url, i) => (
          <div key={`banner-${i}`} className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-3 rounded-lg group">
            <div className="w-32 h-16 bg-gray-200 rounded overflow-hidden shrink-0 relative">
              <img src={url} alt={`Banner ${i}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-700 truncate">{url.split('/').pop()}</p>
              <p className="text-xs text-green-600 mt-0.5 font-medium">Activo en la tienda</p>
            </div>
            
            <div className="flex flex-col gap-1 px-2 border-r border-gray-200 opacity-50 group-hover:opacity-100 transition-opacity">
               <button onClick={() => {
                 if (i === 0) return;
                 const arr = [...heroBanners];
                 [arr[i], arr[i-1]] = [arr[i-1], arr[i]];
                 setHeroBanners(arr);
               }} disabled={i === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><MoveUp className="w-4 h-4"/></button>
               <button onClick={() => {
                 if (i === heroBanners.length - 1) return;
                 const arr = [...heroBanners];
                 [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
                 setHeroBanners(arr);
               }} disabled={i === heroBanners.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><MoveDown className="w-4 h-4"/></button>
            </div>

            <div className="pl-2">
              <button
                onClick={() => setHeroBanners(heroBanners.filter((_, idx) => idx !== i))}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {filesToUpload.map((file, i) => (
          <div key={`file-${i}`} className="flex items-center gap-4 bg-blue-50/50 border border-blue-200 p-3 rounded-lg">
            <div className="w-32 h-16 bg-blue-100 rounded overflow-hidden shrink-0 relative">
              <img src={URL.createObjectURL(file)} alt={`New Banner ${i}`} className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-blue-900 truncate">{file.name}</p>
              <p className="text-xs text-blue-600 mt-0.5">Sin guardar, penda en la cola...</p>
            </div>
            <div className="pl-2">
              <button
                onClick={() => setFilesToUpload(filesToUpload.filter((_, idx) => idx !== i))}
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-400 transition-colors w-full cursor-pointer mt-4"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
             <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700">Agregar un banner</p>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files) {
               setFilesToUpload([...filesToUpload, ...Array.from(e.target.files)]);
            }
          }}
          accept="image/*"
          className="hidden"
          multiple
        />
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENT: Badges Editor
// ==========================================
type Badge = { text: string; color: string };

function BadgesEditor() {
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
