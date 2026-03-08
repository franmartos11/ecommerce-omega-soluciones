import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import { Plus, X, List, Loader2 } from "lucide-react";
import type { Config, PromoCategoryConfig } from "@/lib/config.types";
import { Product } from "@/components/ProductCardGrid/ProductCardGrid";
import { supabase } from "@/app/lib/supabase/client";
import { mapConfigProductsToUI } from "@/utils/productMapper";

interface PromoCategoriesEditorProps {
  config: Config;
  onChange: (promoCategories: PromoCategoryConfig[]) => void;
}

export function PromoCategoriesEditor({ config, onChange }: PromoCategoriesEditorProps) {
  const [promos, setPromos] = useState<PromoCategoryConfig[]>(config.home?.promoCategories || []);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // States for handling specific product selection modal
  const [selectingForPromoIndex, setSelectingForPromoIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedProductIds, setTempSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    // Initial sync in case the parent config changes
    setPromos(config.home?.promoCategories || []);
  }, [config.home?.promoCategories]);

  useEffect(() => {
    async function loadAllProducts() {
      setLoadingProducts(true);
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
           const data = await res.json();
           setProducts(data);
        } else {
           // Si falla la API, usar del config fallback
           setProducts(mapConfigProductsToUI(config.Productos || []));
        }
      } catch (err) {
        console.error("Error fetching products for selection:", err);
        setProducts(mapConfigProductsToUI(config.Productos || []));
      } finally {
        setLoadingProducts(false);
      }
    }
    loadAllProducts();
  }, [config.Productos]);

  const updatePromo = (index: number, key: keyof PromoCategoryConfig, value: PromoCategoryConfig[typeof key]) => {
    const updated = [...promos];
    updated[index] = { ...updated[index], [key]: value };
    setPromos(updated);
    onChange(updated);
  };

  const addPromo = () => {
    const newPromo: PromoCategoryConfig = {
      id: `promo-${Date.now()}`,
      title: "Nuevo Carrusel",
      bannerImage: "https://dummyimage.com/600x900/333/fff&text=Nuevo+Banner",
      categorySlug: "",
      active: true,
      productIds: [],
    };
    const updated = [...promos, newPromo];
    setPromos(updated);
    onChange(updated);
  };

  const removePromo = (index: number) => {
    if (!confirm("¿Seguro que deseas eliminar este carrusel?")) return;
    const updated = [...promos];
    updated.splice(index, 1);
    setPromos(updated);
    onChange(updated);
  };

  // Image upload
  const handleImageUpload = async (index: number, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `promo_banner_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error } = await supabase.storage.from('products').upload(fileName, file);
      if (error) throw new Error("Error al subir a Supabase");

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      updatePromo(index, "bannerImage", data.publicUrl);
    } catch {
      alert("Hubo un error subiendo la imagen del banner.");
    }
  };

  const getProductTitle = (id: string) => {
    return products.find(p => p.id === id)?.title || `Producto no encontrado (${id})`;
  };

  const toggleProductSelection = (productId: string) => {
    setTempSelectedProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleOpenProductSelection = (index: number) => {
    setTempSelectedProductIds(promos[index].productIds || []);
    setSelectingForPromoIndex(index);
  };

  const handleSaveProductSelection = () => {
    if (selectingForPromoIndex !== null) {
      updatePromo(selectingForPromoIndex, "productIds", tempSelectedProductIds);
      setSelectingForPromoIndex(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <List className="w-5 h-5 text-gray-500" />
            Carruseles Promocionales
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los carruseles que se muestran en el inicio. Puedes enlazar a una categoría o elegir productos exactos.
          </p>
        </div>
        <button
          onClick={addPromo}
          className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-blue-200"
        >
          <Plus className="w-4 h-4" />
          Agregar Carrusel
        </button>
      </div>

      <div className="space-y-8">
        {promos.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No hay carruseles configurados.</p>
          </div>
        )}

        {promos.map((promo, index) => (
          <div key={promo.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative">
            <button
              onClick={() => removePromo(index)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar Carrusel"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Columna Izquierda: Banner y Título */}
              <div className="space-y-4 lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Título del Carrusel</label>
                   <input
                     type="text"
                     value={promo.title}
                     onChange={(e) => updatePromo(index, "title", e.target.value)}
                     className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 outline-none text-sm"
                     placeholder="Ej: Ofertas Especiales"
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Slider Activo</label>
                   <div className="flex items-center mt-2">
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="sr-only peer" 
                         checked={promo.active !== false}
                         onChange={(e) => updatePromo(index, "active", e.target.checked)}
                       />
                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                       <span className="ml-3 text-sm font-medium text-gray-700">
                         {promo.active !== false ? 'Activo (Visible en inicio)' : 'Oculto'}
                       </span>
                     </label>
                   </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Banner (Izq.)</label>
                   <div className="relative group w-full aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                     <NextImage src={promo.bannerImage} alt={promo.title} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                       <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow hover:bg-gray-100 mb-2">
                         Cambiar Imagen
                         <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              if(e.target.files && e.target.files[0]) {
                                handleImageUpload(index, e.target.files[0]);
                              }
                            }}
                         />
                       </label>
                    </div>
                  </div>
                  <input
                     type="text"
                     value={promo.bannerLink || ""}
                     onChange={(e) => updatePromo(index, "bannerLink", e.target.value)}
                     className="w-full mt-2 px-3 py-2 rounded border border-gray-300 text-xs placeholder-gray-400"
                     placeholder="URL destino al clickear el banner (Opcional)"
                  />
                </div>
              </div>

              {/* Columna Derecha: Selección de Productos */}
              <div className="space-y-4 lg:col-span-2">
                 <h3 className="text-sm font-medium text-gray-900">Configuración de Productos</h3>
                 <p className="text-xs text-gray-500 mb-4">
                   Puedes elegir productos específicos para este carrusel o, si lo dejas vacío, filtrar por una categoría.
                 </p>

                 <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                       <label className="text-sm font-medium text-blue-900">
                         Productos Específicos ({promo.productIds?.length || 0} seleccionados)
                       </label>
                       <button
                         onClick={() => handleOpenProductSelection(index)}
                         className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded shadow-sm transition-colors"
                       >
                         {promo.productIds?.length ? "Editar Selección" : "Seleccionar Productos"}
                       </button>
                    </div>
                    
                    {promo.productIds && promo.productIds.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {promo.productIds.map(id => (
                          <span key={id} className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-800 text-xs px-2 py-1 rounded-md shadow-sm">
                            <span className="truncate max-w-[150px]">{getProductTitle(id)}</span>
                            <button 
                               onClick={() => {
                                 const currentIds = promo.productIds || [];
                                 updatePromo(index, "productIds", currentIds.filter(pid => pid !== id));
                               }}
                               className="text-blue-400 hover:text-red-500 ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-blue-600/70 italic">
                        No hay productos elegidos. Se usará el filtro por categoría abajo.
                      </div>
                    )}
                 </div>

                 {!promo.productIds?.length && (
                   <div className="pt-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       Slug de Categoría (Fallback)
                     </label>
                     <input
                       type="text"
                       value={promo.categorySlug}
                       onChange={(e) => updatePromo(index, "categorySlug", e.target.value)}
                       className="w-full sm:w-1/2 px-3 py-2 rounded-lg border border-gray-300 outline-none text-sm focus:border-blue-500"
                       placeholder="Ej: tecnologia"
                     />
                     <p className="text-xs text-gray-400 mt-1">
                       Si no hay productos seleccionados arriba, se mostrarán todos los que coincidan con esta categoría.
                     </p>
                   </div>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Selección de Productos */}
      {selectingForPromoIndex !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
               <h3 className="text-lg font-bold text-gray-900">
                 Seleccionar Productos para &ldquo;{promos[selectingForPromoIndex].title}&rdquo;
               </h3>
               <button onClick={() => setSelectingForPromoIndex(null)} className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="p-4 border-b border-gray-100 bg-gray-50">
               <input
                 type="text"
                 autoFocus
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Buscar por nombre o marca..."
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none shadow-sm"
               />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               {loadingProducts ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
               ) : filteredProducts.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No se encontraron productos.</p>
               ) : (
                  filteredProducts.map(product => {
                    const isSelected = tempSelectedProductIds.includes(product.id);
                    return (
                      <div 
                        key={product.id}
                        onClick={() => toggleProductSelection(product.id)}
                        className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white"
                        }`}
                      >
                        <div className="relative w-12 h-12 bg-white rounded border border-gray-100 shrink-0 overflow-hidden">
                           <NextImage src={product.imageUrl} alt={product.title} fill className="object-contain p-1" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className={`text-sm font-medium truncate ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                             {product.title}
                           </p>
                           <p className="text-xs text-gray-500">{product.brand || "Sin marca"} • ${product.currentPrice}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                        }`}>
                           {isSelected && <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                        </div>
                      </div>
                    );
                  })
               )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
               <button
                 onClick={handleSaveProductSelection}
                 className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
               >
                 Listo
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
