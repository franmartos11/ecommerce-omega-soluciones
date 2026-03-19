"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, X, ImageIcon, AlertCircle, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase/client";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  active: boolean;
  oldPrice?: number;
  sku?: string;
  tags?: string[];
  mfg?: string;
  life?: string;
  rating?: number;
  color?: string;
  badgeText?: string;
  badgeColor?: string;
  galleryUrls?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants?: any[];
  createdAt: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, nombre: string}[]>([]);
  const [globalBadges, setGlobalBadges] = useState<{text: string, color: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const existingTags = Array.from(
    new Set(products.flatMap((p) => p.tags || []))
  ).filter(Boolean).sort();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: "",
    imageUrl: "",
    galleryUrls: [] as string[],
    category: "",
    sku: "",
    tags: "", // We manage tags as a comma separated string in the form
    mfg: "",
    life: "",
    rating: "5",
    color: "",
    badgeText: "",
    badgeColor: "bg-red-500 text-white",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants: [] as any[],
    active: true,
  });

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, settingsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/settings")
      ]);
      
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const badgeSetting = settingsData.find((s: { key: string; value: unknown }) => s.key === "product_badges");
        if (badgeSetting && badgeSetting.value) {
           setGlobalBadges(Array.isArray(badgeSetting.value) ? badgeSetting.value : []);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        title: product.title,
        description: product.description || "",
        price: product.price.toString(),
        oldPrice: product.oldPrice ? product.oldPrice.toString() : "",
        stock: product.stock.toString(),
        imageUrl: product.imageUrl || "",
        category: product.category || "",
        sku: product.sku || "",
        tags: product.tags ? product.tags.join(", ") : "",
        mfg: product.mfg || "",
        life: product.life || "",
        rating: product.rating ? product.rating.toString() : "5",
        color: product.color || "",
        badgeText: product.badgeText || "",
        badgeColor: product.badgeColor || "bg-red-500 text-white",
        galleryUrls: product.galleryUrls || [],
        variants: product.variants || [],
        active: product.active,
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        oldPrice: "",
        stock: "",
        imageUrl: "",
        galleryUrls: [],
        category: "",
        sku: "",
        tags: "",
        mfg: "",
        life: "",
        rating: "5",
        color: "",
        badgeText: "",
        badgeColor: "bg-red-500 text-white",
        variants: [],
        active: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setGalleryFiles([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setGalleryFiles([]);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = formData.imageUrl;
    let finalGalleryUrls = [...formData.galleryUrls];

    if (imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(`Error al subir imagen: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error subiendo imagen";
        alert(msg || "Hubo un error al subir la imagen al bucket.");
        setIsSubmitting(false);
        return;
      }
    }

    if (galleryFiles.length > 0) {
      try {
        const uploadPromises = galleryFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error } = await supabase.storage.from('products').upload(fileName, file);
          if (error) throw new Error(`Error subiendo ${file.name}: ${error.message}`);
          
          const { data } = supabase.storage.from('products').getPublicUrl(fileName);
          return data.publicUrl;
        });

        const newUrls = await Promise.all(uploadPromises);
        finalGalleryUrls = [...finalGalleryUrls, ...newUrls];
      } catch (err: unknown) {
        const msg2 = err instanceof Error ? err.message : "Error subiendo galería";
        alert(msg2 || "Error al subir la galería de imágenes.");
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      stock: parseInt(formData.stock, 10),
      rating: parseFloat(formData.rating),
      color: formData.color,
      badgeText: formData.badgeText,
      badgeColor: formData.badgeColor,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      imageUrl: finalImageUrl,
      galleryUrls: finalGalleryUrls,
      variants: formData.variants,
      id: editingId || undefined, // Only pass ID if updating
    };

    try {
      const url = "/api/admin/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error saving product");

      await fetchProductsAndCategories();
      handleCloseModal();
    } catch (error) {
      alert("Hubo un error al guardar el producto.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, imageUrl: "" }); // Clean out explicit URL if uploading file
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles([...galleryFiles, ...Array.from(e.target.files)]);
    }
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removeGalleryImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const newUrls = [...formData.galleryUrls];
      newUrls.splice(index, 1);
      setFormData({ ...formData, galleryUrls: newUrls });
    } else {
      const newFiles = [...galleryFiles];
      newFiles.splice(index, 1);
      setGalleryFiles(newFiles);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error deleting product");

      await fetchProductsAndCategories();
    } catch (error) {
      alert("Error al eliminar el producto.");
      console.error(error);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Catálogo de Productos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona tu inventario, actualiza precios y agrega items a tu tienda Omega.
          </p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
          Añadir Producto
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-right">Precio</th>
                <th className="px-6 py-4 text-right">Stock</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mb-3" style={{ color: "var(--color-primary-bg)" }} />
                      <p className="text-sm text-gray-500 font-medium">Cargando catálogo...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium">No se encontraron productos</p>
                    <p className="text-xs text-gray-400 mt-1">Intenta ajustando tu búsqueda o crea uno nuevo.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[200px]" title={product.title}>
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-[200px]" title={product.id}>
                            {product.id.split("-")[0]}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.category ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs text-gray-600 font-medium">
                          {product.category}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Sin categoría</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {product.stock > 0 ? (
                        <span className="text-gray-700">{product.stock} u.</span>
                      ) : (
                        <span className="text-red-500 font-medium text-xs bg-red-50 px-2 py-1 rounded">Agotado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-2 h-2 rounded-full ${product.active ? 'bg-green-500' : 'bg-red-400'}`} title={product.active ? "Activo" : "Inactivo"} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form id="productForm" onSubmit={handleSaveProduct} className="space-y-6">
                
                {/* Row 1: Title and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                      placeholder="Ej. Termo Stanley"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow bg-white"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="" disabled>Seleccionar categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.nombre}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Prices and Stock */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Precio * ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 text-gray-500 line-through">Precio Viejo</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Opcional"
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stock *</label>
                    <input
                      type="number"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                      placeholder="Ej. OMEGA-123"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                {/* Row 3: Extended Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Color Principal</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Ej. Negro, Plata"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fabricante (Mfg)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Ej. China"
                      value={formData.mfg}
                      onChange={(e) => setFormData({ ...formData, mfg: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Vida / Garantía</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Ej. 1 Año"
                      value={formData.life}
                      onChange={(e) => setFormData({ ...formData, life: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Etiquetas</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="tecnologia, oferta, nuevo"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                  {existingTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {existingTags.map(tag => {
                        const currentTags = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
                        const isSelected = currentTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setFormData({ ...formData, tags: currentTags.filter(t => t !== tag).join(", ") });
                              } else {
                                const newTags = currentTags.length > 0 ? [...currentTags, tag] : [tag];
                                setFormData({ ...formData, tags: newTags.join(", ") });
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                              isSelected 
                                ? "bg-blue-100 text-blue-700 border-blue-200" 
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {tag} {isSelected && "×"}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5">Escribe nuevas separadas por coma, o haz clic en las existentes para añadir/quitar.</p>
                </div>

                {/* Row 4: Badge Overrides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Etiqueta Promocional</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        value={formData.badgeText || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) {
                             setFormData({ ...formData, badgeText: "", badgeColor: "bg-red-500 text-white" });
                          } else {
                             const sel = globalBadges.find(b => b.text === val);
                             setFormData({ ...formData, badgeText: val, badgeColor: sel?.color || "bg-red-500 text-white" });
                          }
                        }}
                      >
                         <option value="">Ninguna / Descuento Automático</option>
                         {globalBadges.map(b => (
                           <option key={b.text} value={b.text}>{b.text}</option>
                         ))}
                      </select>
                   </div>
                   {formData.badgeText && (
                     <div className="flex items-end pb-2">
                       <span className={`px-3 py-1.5 text-xs font-semibold rounded-full tracking-wide ${formData.badgeColor}`}>
                         Visor: {formData.badgeText}
                       </span>
                     </div>
                   )}
                </div>

                {/* Row 5: Variants */}
                <div className="pt-4 border-t border-gray-100 mt-6 pb-2">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-gray-700">Variantes del Producto</label>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, variants: [...prev.variants, { id: "", name: "", sku: "", price: "", stock: "0" }] }))}
                      className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-md"
                    >
                      <Plus className="w-4 h-4" /> Añadir Variante
                    </button>
                  </div>
                  
                  {formData.variants.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No hay variantes configuradas. Usa el botón superior para agregar opciones de talles, colores o sabores únicos.</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.variants.map((v, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                              <input required type="text" placeholder="Ej. Talle L" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={v.name || ""} onChange={(e) => { const n = [...formData.variants]; n[idx].name = e.target.value; setFormData({...formData, variants: n}) }} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
                              <input type="text" placeholder="Opcional" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={v.sku || ""} onChange={(e) => { const n = [...formData.variants]; n[idx].sku = e.target.value; setFormData({...formData, variants: n}) }} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Precio Opcional</label>
                              <input type="number" step="0.01" placeholder="Solo si cambia" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={v.price || ""} onChange={(e) => { const n = [...formData.variants]; n[idx].price = e.target.value; setFormData({...formData, variants: n}) }} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
                              <input required type="number" placeholder="Ej. 10" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={v.stock || ""} onChange={(e) => { const n = [...formData.variants]; n[idx].stock = e.target.value; setFormData({...formData, variants: n}) }} />
                            </div>
                          </div>
                          <button type="button" onClick={() => { const n = [...formData.variants]; n.splice(idx, 1); setFormData({...formData, variants: n}); }} className="mt-5 p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors" title="Remove variant">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Imagen del Producto</label>
                  
                  {imagePreview ? (
                    <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-gray-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData({ ...formData, imageUrl: "" });
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-md backdrop-blur-sm transition-colors shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full max-w-sm border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 mb-2" />
                      <p className="text-sm font-medium">Subir Imagen</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP hasta 5MB</p>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">O usar URL:</span>
                    <input
                      type="url"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                      placeholder="https://.../imagen.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value });
                        if (e.target.value) {
                          setImageFile(null);
                          setImagePreview(e.target.value);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        } else {
                          setImagePreview(null);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700">Galería de Imágenes (Secundarias)</label>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {/* Existing URLs */}
                    {formData.galleryUrls.map((url, i) => (
                      <div key={`url-${i}`} className="relative rounded-lg overflow-hidden border border-gray-200 aspect-square group">
                        <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i, true)}
                          className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white border border-gray-200 text-red-500 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    
                    {/* New Files */}
                    {galleryFiles.map((file, i) => (
                      <div key={`file-${i}`} className="relative rounded-lg overflow-hidden border-2 border-blue-200 aspect-square group">
                        <img src={URL.createObjectURL(file)} alt="New Gallery" className="w-full h-full object-cover opacity-80" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i, false)}
                          className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white border border-gray-200 text-red-500 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <div 
                      onClick={() => galleryInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 cursor-pointer aspect-square transition-colors"
                    >
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-center px-1">Añadir</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleGalleryChange}
                    accept="image/jpeg, image/png, image/webp, image/gif"
                    multiple
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500">Estas imágenes aparecerán en el carrusel debajo de la foto principal en la página del producto.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none"
                    placeholder="Breve descripción del producto..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="activeToggle"
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <label htmlFor="activeToggle" className="text-sm text-gray-700 select-none">
                    Producto Activo (Visible en tienda)
                  </label>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="productForm"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
