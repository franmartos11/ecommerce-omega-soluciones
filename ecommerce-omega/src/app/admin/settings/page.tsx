"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Config } from "@/lib/config.types";
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
      } catch (err: unknown) {
        setJsonError(err instanceof Error ? err.message : "JSON inválido");
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

  const updateConfig = (path: string[], value: unknown) => {
    setConfig((prev: Config | null) => {
      if (!prev) return prev;
      const newConfig = { ...prev };
      let current: Record<string, unknown> = newConfig as unknown as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]] as Record<string, unknown>;
      }
      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  if (isLoading || !config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary-bg)" }} />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Cargando configuración...</p>
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
    { id: "payments", label: "Pagos y Descuentos" },
    { id: "advanced", label: "Avanzado (JSON)" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            Configuración de la Tienda
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los colores, información de contacto y detalles generales.
          </p>
        </div>
        
        <button 
            type="submit" 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-theme-primary-text bg-theme-primary hover:bg-theme-secondary font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Guardando..." : "Guardar Cambios"}
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

      {/* Layout Wrapper */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0 md:sticky md:top-8 md:self-start">
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 gap-1 scrollbar-hide border-b md:border-b-0 border-gray-200 mb-6 md:mb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (activeTab === "advanced" && !jsonError) {
                     try { setConfig(JSON.parse(rawJson)); } catch {} 
                  }
                  if (tab.id === "advanced") {
                     setRawJson(JSON.stringify(config, null, 2));
                  }
                  setActiveTab(tab.id);
                }}
                className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  activeTab === tab.id
                    ? "bg-gray-50 text-theme-secondary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Tab Contents */}
        <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary focus:border-theme-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dominio</label>
                <input 
                  type="text" 
                  value={config.sitio?.dominio || ""} 
                  onChange={(e) => updateConfig(["sitio", "dominio"], e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary focus:border-theme-primary outline-none transition-all"
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
                <textarea 
                  value={config.SEO?.descripcion || ""} 
                  onChange={(e) => updateConfig(["SEO", "descripcion"], e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary outline-none transition-all resize-none"
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
            
            <div className="bg-gray-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-theme-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-theme-secondary">
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={(config.Soporte as any)?.tel || config.NumTelefonoSoporte || ""} 
                  onChange={(e) => {
                     updateConfig(["Soporte", "tel"], e.target.value);
                     updateConfig(["NumTelefonoSoporte"], e.target.value);
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary outline-none transition-all"
                  placeholder="+54 9 351 000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Principal</label>
                <input 
                  type="email" 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value={(config.Soporte as any)?.email || ""} 
                  onChange={(e) => updateConfig(["Soporte", "email"], e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary outline-none transition-all"
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
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary outline-none transition-all"
                    placeholder={`https://www.${red.toLowerCase()}.com/tu-usuario`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAYMENTS TAB --- */}
        {activeTab === "payments" && (
          <div className="space-y-8 max-w-2xl text-left">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-6">Transferencia Bancaria</h2>
              
              <div className="space-y-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                
                {/* Descuento Section */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={config.payment_config?.transfer?.discount_enabled || false}
                        onChange={(e) => updateConfig(["payment_config", "transfer", "discount_enabled"], e.target.checked)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${config.payment_config?.transfer?.discount_enabled ? 'bg-theme-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${config.payment_config?.transfer?.discount_enabled ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Habilitar Descuento por Transferencia</span>
                  </label>
                  
                  {config.payment_config?.transfer?.discount_enabled && (
                    <div className="mt-4 flex gap-4 pl-12 animate-in fade-in slide-in-from-top-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de Descuento</label>
                        <select
                          value={config.payment_config?.transfer?.discount_type || "percentage"}
                          onChange={(e) => {
                             updateConfig(["payment_config", "transfer", "discount_type"], e.target.value);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-theme-primary outline-none transition-all"
                        >
                          <option value="percentage">Porcentaje (%)</option>
                          <option value="fixed">Monto Fijo ($)</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Valor</label>
                        <div className="relative">
                          {config.payment_config?.transfer?.discount_type !== "percentage" && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          )}
                          <input
                            type="number"
                            min="0"
                            step={config.payment_config?.transfer?.discount_type === "percentage" ? "1" : "100"}
                            value={config.payment_config?.transfer?.discount_value || ""}
                            onChange={(e) => updateConfig(["payment_config", "transfer", "discount_value"], parseFloat(e.target.value) || 0)}
                            className={`w-full ${config.payment_config?.transfer?.discount_type !== "percentage" ? 'pl-7' : 'pl-3'} pr-8 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-theme-primary outline-none transition-all`}
                            placeholder="Ej: 10"
                          />
                          {config.payment_config?.transfer?.discount_type === "percentage" && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                {/* Bank Data Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Datos Bancarios del Negocio</h3>
                  <p className="text-xs text-gray-500">Estos datos se mostrarán al cliente cuando elija pagar por transferencia.</p>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Banco</label>
                      <input 
                        type="text" 
                        value={config.payment_config?.transfer?.bank_name || ""} 
                        onChange={(e) => updateConfig(["payment_config", "transfer", "bank_name"], e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-theme-primary outline-none"
                        placeholder="Ej: Banco Galicia"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CBU / CVU</label>
                      <input 
                        type="text" 
                        value={config.payment_config?.transfer?.cbu || ""} 
                        onChange={(e) => updateConfig(["payment_config", "transfer", "cbu"], e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-theme-primary outline-none"
                        placeholder="22 números"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Alias</label>
                      <input 
                        type="text" 
                        value={config.payment_config?.transfer?.alias || ""} 
                        onChange={(e) => updateConfig(["payment_config", "transfer", "alias"], e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-mono uppercase focus:ring-2 focus:ring-theme-primary outline-none"
                        placeholder="MI.NEGOCIO.PAGOS"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Titular de la cuenta</label>
                      <input 
                        type="text" 
                        value={config.payment_config?.transfer?.account_holder || ""} 
                        onChange={(e) => updateConfig(["payment_config", "transfer", "account_holder"], e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-theme-primary outline-none"
                        placeholder="Nombre o Razón Social"
                      />
                    </div>
                  </div>
                </div>

              </div>
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
                } catch (err: unknown) {
                  setJsonError(err instanceof Error ? err.message : "JSON inválido");
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
    </div>
  );
}
