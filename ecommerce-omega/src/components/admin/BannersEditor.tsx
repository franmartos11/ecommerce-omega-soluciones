import React, { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import { Loader2, X, Image as ImageIcon, Layout, MoveUp, MoveDown, Save } from "lucide-react";
import { supabase } from "@/app/lib/supabase/client";

export function BannersEditor() {
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
        const heroSetting = data.find((s: { key: string; value: unknown }) => s.key === "hero_banners");
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
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      alert(`Hubo un error al guardar banners: ${msg}`);
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
            <div className="relative w-32 h-16 bg-gray-200 rounded overflow-hidden shrink-0">
              <NextImage src={url} alt={`Banner ${i}`} fill className="object-cover" unoptimized />
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
                title="Eliminar banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {filesToUpload.map((file, i) => (
          <div key={`file-${i}`} className="flex items-center gap-4 bg-blue-50/50 border border-blue-200 p-3 rounded-lg">
            <div className="relative w-32 h-16 bg-blue-100 rounded overflow-hidden shrink-0">
              <NextImage src={URL.createObjectURL(file)} alt={`New Banner ${i}`} fill className="object-cover opacity-80" unoptimized />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-blue-900 truncate">{file.name}</p>
              <p className="text-xs text-blue-600 mt-0.5">Sin guardar, penda en la cola...</p>
            </div>
            <div className="pl-2">
              <button
                onClick={() => setFilesToUpload(filesToUpload.filter((_, idx) => idx !== i))}
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar de la cola"
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
