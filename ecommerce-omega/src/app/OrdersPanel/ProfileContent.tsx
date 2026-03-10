"use client";

import React, { useState, useEffect } from "react";
import { Lock, MapPin, Plus, Loader2, Save, Trash2, Edit2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase/client";
import { toast } from "react-hot-toast";

type UserAddress = {
  id: string;
  first_name: string;
  last_name: string;
  address_line: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
};

type UserProfile = {
  id: string;
  email?: string;
};

export default function ProfileContent({ user }: { user: UserProfile }) {
  const [activeSubTab, setActiveSubTab] = useState<"security" | "addresses">("security");
  
  // Security State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  
  // Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", address_line: "", city: "", 
    province: "", postal_code: "", phone: "", is_default: false
  });

  useEffect(() => {
    if (activeSubTab === "addresses") {
      fetchAddresses();
    }
  }, [activeSubTab, user.id]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .order("is_default", { ascending: false });
        
      if (!error && data) {
        setAddresses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingPassword(false);

    if (error) {
      toast.error("Error al actualizar contraseña");
      console.error(error);
    } else {
      toast.success("Contraseña actualizada correctamente");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);

    const payload = { ...formData, user_id: user.id };

    let res;
    if (editingId) {
      res = await supabase.from("user_addresses").update(payload).eq("id", editingId);
    } else {
      res = await supabase.from("user_addresses").insert([payload]);
    }

    setSavingAddress(false);

    if (res.error) {
      toast.error("Error al guardar la dirección");
      console.error(res.error);
    } else {
      toast.success(editingId ? "Dirección actualizada" : "Dirección guardada");
      setShowAddressForm(false);
      setEditingId(null);
      resetForm();
      fetchAddresses();
    }
  };

  const deleteAddress = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("¿Seguro que deseas eliminar esta dirección?")) return;
    
    const { error } = await supabase.from("user_addresses").delete().eq("id", id);
    if (!error) {
      toast.success("Dirección eliminada");
      setAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  const startEditing = (addr: UserAddress) => {
    setFormData({
      first_name: addr.first_name, last_name: addr.last_name,
      address_line: addr.address_line, city: addr.city,
      province: addr.province, postal_code: addr.postal_code,
      phone: addr.phone, is_default: addr.is_default
    });
    setEditingId(addr.id);
    setShowAddressForm(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: "", last_name: "", address_line: "", city: "", 
      province: "", postal_code: "", phone: "", is_default: false
    });
  };

  const inputClass = "w-full border rounded-md py-2.5 px-3 text-sm outline-none transition focus:ring-2 focus:ring-opacity-30";
  const inputStyle = {
    borderColor: "var(--border, #e5e7eb)",
    color: "var(--color-primary-text)",
    background: "var(--surface, #ffffff)",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* Tab Navigation Intero */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab("security")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition duration-200 ${activeSubTab === "security" ? "border-b-2" : "text-gray-500 hover:bg-gray-50"}`}
          style={activeSubTab === "security" ? { borderColor: "var(--color-primary-bg)", color: "var(--color-primary-bg)" } : {}}
        >
          <Lock className="w-4 h-4" /> Seguridad
        </button>
        <button
          onClick={() => setActiveSubTab("addresses")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition duration-200 ${activeSubTab === "addresses" ? "border-b-2" : "text-gray-500 hover:bg-gray-50"}`}
          style={activeSubTab === "addresses" ? { borderColor: "var(--color-primary-bg)", color: "var(--color-primary-bg)" } : {}}
        >
          <MapPin className="w-4 h-4" /> Direcciones guardadas
        </button>
      </div>

      <div className="p-6 md:p-8">
        
        {/* TAB SEGURIDAD */}
        {activeSubTab === "security" && (
          <div className="max-w-md animate-in fade-in duration-300">
            <h3 className="text-xl font-bold mb-1">Cambiar la contraseña</h3>
            <p className="text-sm text-gray-500 mb-6">Actualiza tu contraseña para mantener tu cuenta segura.</p>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-secondary-text)" }}>Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-secondary-text)" }}>Confirmar Contraseña</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              
              <button
                type="submit"
                disabled={updatingPassword || !newPassword || !confirmPassword}
                className="w-full mt-4 cursor-pointer py-2.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{ background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)" }}
                onMouseEnter={e => !updatingPassword && newPassword && confirmPassword && (e.currentTarget.style.background = "var(--color-secondary-bg)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--color-primary-bg)")}
              >
                {updatingPassword ? <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--color-primary-bg)" }} /> : <Save className="w-5 h-5" />}
                Actualizar Contraseña
              </button>
            </form>
          </div>
        )}

        {/* TAB DIRECCIONES */}
        {activeSubTab === "addresses" && (
          <div className="animate-in fade-in duration-300">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">Libreta de Direcciones</h3>
                <p className="text-sm text-gray-500">Agrega direcciones para agilizar tus compras.</p>
              </div>
              
              {!showAddressForm && (
                <button
                  onClick={() => { resetForm(); setEditingId(null); setShowAddressForm(true); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: "var(--color-secondary-bg)", color: "var(--color-primary-bg)" }}
                >
                  <Plus className="w-4 h-4" /> Nueva Dirección
                </button>
              )}
            </div>

            {/* FORMULARIO */}
            {showAddressForm ? (
              <form onSubmit={handleAddressSubmit} className="p-6 rounded-xl border mb-6 shadow-sm" style={{ background: "var(--surface, #ffffff)", borderColor: "var(--border, #e5e7eb)" }}>
                <h4 className="font-bold mb-4">{editingId ? "Editar Dirección" : "Añadir Nueva Dirección"}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-secondary-text)" }}>Nombre</label>
                    <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-secondary-text)" }}>Apellido</label>
                    <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className={inputClass} style={inputStyle} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-secondary-text)" }}>Calle y Altura</label>
                    <input required type="text" value={formData.address_line} onChange={e => setFormData({...formData, address_line: e.target.value})} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-secondary-text)" }}>Ciudad</label>
                    <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-secondary-text)" }}>Provincia</label>
                    <input required type="text" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-secondary-text)" }}>Código Postal</label>
                    <input required type="text" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-secondary-text)" }}>Teléfono</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                
                <label className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={formData.is_default} onChange={e => setFormData({...formData, is_default: e.target.checked})} className="rounded focus:ring-0" style={{ color: "var(--color-primary-bg)" }} />
                  Convertir en dirección por defecto
                </label>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={savingAddress} className="flex items-center gap-2 px-6 py-2 rounded-md border text-sm font-medium transition-colors cursor-pointer" style={{ background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)", borderColor: "transparent" }}
                    onMouseEnter={e => !savingAddress && ((e.currentTarget as HTMLElement).style.background = "var(--color-secondary-bg)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--color-primary-bg)")}>
                    {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--color-tertiary-text)" }} /> : <Save className="w-4 h-4" />}
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              // LISTA
              <>
                {loadingAddresses ? (
                  <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary-bg)" }} /></div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No has guardado ninguna dirección</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`relative p-5 rounded-xl border transition-all hover:shadow-md ${addr.is_default ? 'ring-1' : 'border-gray-200 bg-white'}`} style={addr.is_default ? { borderColor: "var(--color-primary-bg)", background: "var(--color-secondary-bg)" } : {}}>
                        {addr.is_default && (
                          <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)" }}>Por defecto</span>
                        )}
                        <h4 className="font-bold text-gray-900">{addr.first_name} {addr.last_name}</h4>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {addr.address_line}<br/>
                          {addr.city}, {addr.province} (CP {addr.postal_code})<br/>
                          Tel: {addr.phone}
                        </p>
                        
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                          <button onClick={() => startEditing(addr)} className="text-sm font-medium flex items-center gap-1 transition-colors" style={{ color: "var(--color-primary-bg)" }}>
                            <Edit2 className="w-3.5 h-3.5" /> Editar
                          </button>
                          <span className="text-gray-300">|</span>
                          <button onClick={(e) => deleteAddress(addr.id, e)} className="text-sm font-medium text-gray-600 hover:text-red-600 flex items-center gap-1 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
