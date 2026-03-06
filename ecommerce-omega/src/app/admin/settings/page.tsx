"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Config } from "@/lib/config.types";
import { supabase } from "@/app/lib/supabase/client";
import { PromoCategoriesEditor } from "@/components/admin/PromoCategoriesEditor";
import { BannersEditor } from "@/components/admin/BannersEditor";
import { BadgesEditor } from "@/components/admin/BadgesEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ColorInput } from "@/components/admin/ColorInput";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("theme");
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

    if (activeTab === "advanced") {
      try {
        payload = JSON.parse(rawJson);
        setJsonError(null);
      } catch (err: any) {
        setJsonError(err.message);
        setIsSaving(false);
        setMessage({ type: "error", text: "Sintaxis JSON inválida. Corrige el error antes de guardar." });
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Fallo al guardar");
      
      const newConfig = await res.json();
      setConfig(newConfig);
      if (activeTab === "advanced") setRawJson(JSON.stringify(newConfig, null, 2));
      
      setMessage({ type: "success", text: "Configuración guardada correctamente." });
    } catch (e) {
      console.error("Error saving config", e);
      setMessage({ type: "error", text: "Hubo un problema al guardar la configuración." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateConfig = (path: string[], value: any) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newConfig = { ...prev };
      let current: any = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  if (isLoading || !config) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General" },
    { id: "branding", label: "Imágenes de Marca" },
    { id: "theme", label: "Tema y Colores" },
    { id: "banners", label: "Banners (Inicio)" },
    { id: "promo", label: "Carruseles Promocionales" },
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
              if (activeTab === "advanced" && !jsonError) {
                 try { setConfig(JSON.parse(rawJson)); } catch(e) {}
              }
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

        {/* --- BRANDING TAB --- */}
        {activeTab === "branding" && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-6">Logos e Imágenes de la Web</h2>
              <div className="space-y-6">
                <ImageUploadField 
                  label="Logo Principal (Navbar, Footer, Login)"
                  subtitle="PNG o SVG con fondo transparente recomendado."
                  value={config.Logo?.src}
                  onChange={(url) => updateConfig(["Logo", "src"], url)}
                />

                <ImageUploadField 
                  label="Favicon (Icono de Pestaña)"
                  subtitle="Se muestra en la pestaña del navegador. Ideal 32x32px o 64x64px (.png, .ico)."
                  value={config.Logo?.favicon}
                  onChange={(url) => updateConfig(["Logo", "favicon"], url)}
                />

                <ImageUploadField 
                  label="Imagen al Compartir Enlace (Open Graph)"
                  subtitle="Se muestra cuando compartes el link en WhatsApp o Redes Sociales. Ideal 1200x630px."
                  value={config.SEO?.ogImage}
                  onChange={(url) => updateConfig(["SEO", "ogImage"], url)}
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

        {/* --- PROMO CAROUSELS TAB --- */}
        {activeTab === "promo" && config && (
          <PromoCategoriesEditor 
            config={config} 
            onChange={(newPromoCategories) => updateConfig(["home", "promoCategories"], newPromoCategories)} 
          />
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
