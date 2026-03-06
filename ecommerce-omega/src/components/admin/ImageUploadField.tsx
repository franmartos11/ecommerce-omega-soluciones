import React, { useState, useRef } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase/client";

interface ImageUploadFieldProps {
  label: string;
  subtitle: string;
  value?: string;
  onChange: (val: string) => void;
}

export function ImageUploadField({ label, subtitle, value, onChange }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `brand_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (error) throw new Error("Error al subir a Supabase");

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      onChange(data.publicUrl);
    } catch (err) {
      alert("Hubo un error subiendo la imagen.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex justify-center items-center overflow-hidden border border-gray-300 relative group">
        {value ? (
          <img src={value} alt="Preview" className="w-full h-full object-contain p-2" />
        ) : (
          <ImageIcon className="w-8 h-8 text-gray-400" />
        )}
        {value && (
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button 
                onClick={() => onChange("")} 
                className="bg-white/90 text-red-600 p-1.5 rounded hover:bg-white text-xs font-semibold cursor-pointer"
              >
                Eliminar
              </button>
           </div>
        )}
      </div>
      
      <div className="flex-1 w-full">
        <label className="block text-sm font-bold text-gray-900 mb-1">{label}</label>
        <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
        
        <div className="flex gap-2 items-center">
           <input
             type="file"
             ref={fileInputRef}
             onChange={handleUpload}
             accept="image/*"
             className="hidden"
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={isUploading}
             className="cursor-pointer px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
           >
             {isUploading ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" /> : <ImageIcon className="w-4 h-4 text-gray-500" />}
             {isUploading ? "Subiendo..." : "Subir Imagen"}
           </button>
           {value && (
              <span className="text-xs text-green-600 font-medium truncate ml-2">Subida</span>
           )}
        </div>
      </div>
    </div>
  );
}
