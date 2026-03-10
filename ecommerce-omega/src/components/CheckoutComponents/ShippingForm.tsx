"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, MapPin, User, Building2, Smartphone } from "lucide-react";

export type ShippingData = {
  deliveryMethod: "shipping" | "pickup";
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone: string;
};

interface Props {
  onNext: (data: ShippingData) => void;
  provinceRates: Record<string, number>;
}

export default function ShippingForm({ onNext, provinceRates }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ShippingData>({ 
    mode: "onTouched",
    defaultValues: { deliveryMethod: "shipping", province: "CABA" }
  });

  const deliveryMethod = watch("deliveryMethod");

  const inputClasses = 
    "w-full border-2 border-gray-100 rounded-xl px-4 py-3 pl-11 focus:outline-none transition-all duration-200 outline-none";

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      className="space-y-6"
    >
      {/* Tipo de Entrega */}
      <div className="space-y-3">
        <label
          className="block text-sm font-semibold ml-1"
          style={{ color: "var(--color-secondary-text)" }}
        >
          Método de entrega
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label
            className={`cursor-pointer flex items-center justify-center py-3 border-2 rounded-xl transition-all ${
              deliveryMethod === "shipping"
                ? "border-[var(--color-primary-bg)] bg-[var(--color-primary-bg)] text-[var(--color-tertiary-text,white)] font-bold"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              value="shipping"
              {...register("deliveryMethod")}
              className="hidden"
            />
            Envío a Domicilio
          </label>
          <label
            className={`cursor-pointer flex items-center justify-center py-3 border-2 rounded-xl transition-all ${
              deliveryMethod === "pickup"
                ? "border-[var(--color-primary-bg)] bg-[var(--color-primary-bg)] text-[var(--color-tertiary-text,white)] font-bold"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              value="pickup"
              {...register("deliveryMethod")}
              className="hidden"
            />
            Retiro en Local
          </label>
        </div>
      </div>

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold ml-1"
            style={{ color: "var(--color-secondary-text)" }}
          >
            Nombre
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-70" />
            <input
              id="firstName"
              type="text"
              placeholder="Tu nombre"
              {...register("firstName", {
                required: "Nombre obligatorio",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
              className={`${inputClasses} ${errors.firstName ? 'border-red-400 bg-red-50/20' : 'bg-gray-50/50 hover:bg-gray-50 focus:bg-white'} focus-within:ring-2`}
              style={{ 
                color: "var(--color-primary-text)", 
                borderColor: errors.firstName ? undefined : "var(--color-border, #f3f4f6)",
                outlineColor: "var(--color-primary-bg)"
              }}
            />
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-xs font-medium mt-1 ml-1 animate-in slide-in-from-top-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="lastName"
            className="block text-sm font-semibold ml-1"
            style={{ color: "var(--color-secondary-text)" }}
          >
            Apellido
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-70" />
            <input
              id="lastName"
              type="text"
              placeholder="Tu apellido"
              {...register("lastName", {
                required: "Apellido obligatorio",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                maxLength: { value: 30, message: "Máximo 30 caracteres" },
              })}
              className={`${inputClasses} ${errors.lastName ? 'border-red-400 bg-red-50/20' : 'bg-gray-50/50 hover:bg-gray-50 focus:bg-white'} focus-within:ring-2`}
              style={{ 
                color: "var(--color-primary-text)", 
                borderColor: errors.lastName ? undefined : "var(--color-border, #f3f4f6)",
                outlineColor: "var(--color-primary-bg)"
              }}
            />
          </div>
          {errors.lastName && (
            <p className="text-red-500 text-xs font-medium mt-1 ml-1 animate-in slide-in-from-top-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Datos Físicos de Entrega (sólo si es envío) */}
      {deliveryMethod === "shipping" && (
        <div className="space-y-6 animate-in slide-in-from-top-2">
          {/* Dirección */}
          <div className="space-y-1">
            <label
              htmlFor="address"
              className="block text-sm font-semibold ml-1"
              style={{ color: "var(--color-secondary-text)" }}
            >
              Dirección de entrega
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-70" />
              <input
                id="address"
                type="text"
                placeholder="Ej: Av. Siempreviva 742"
                {...register("address", {
                  required: "Dirección obligatoria",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                })}
                className={`${inputClasses} ${errors.address ? 'border-red-400 bg-red-50/20' : 'bg-gray-50/50 hover:bg-gray-50 focus:bg-white'} focus-within:ring-2`}
                style={{ 
                  color: "var(--color-primary-text)", 
                  borderColor: errors.address ? undefined : "var(--color-border, #f3f4f6)",
                  outlineColor: "var(--color-primary-bg)"
                }}
              />
            </div>
            {errors.address && (
               <p className="text-red-500 text-xs font-medium mt-1 ml-1 animate-in slide-in-from-top-1">{errors.address.message}</p>
            )}
           </div>

           {/* Ciudad, Provincia, Código Postal */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
             <div className="space-y-1">
                <label
                 htmlFor="city"
                 className="block text-sm font-semibold ml-1"
                 style={{ color: "var(--color-secondary-text)" }}
               >
                 Ciudad
               </label>
               <div className="relative">
                 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-70" />
                 <input
                   id="city"
                   type="text"
                   placeholder="Tu ciudad"
                   {...register("city", { required: "Obligatoria" })}
                   className={`${inputClasses} ${errors.city ? 'border-red-400 bg-red-50/20' : 'bg-gray-50/50 hover:bg-gray-50 focus:bg-white'} focus-within:ring-2`}
                   style={{ 
                     color: "var(--color-primary-text)", 
                     borderColor: errors.city ? undefined : "var(--color-border, #f3f4f6)",
                     outlineColor: "var(--color-primary-bg)"
                   }}
                 />
               </div>
               {errors.city && (
                 <p className="text-red-500 text-xs font-medium mt-1 ml-1 animate-in slide-in-from-top-1">{errors.city.message}</p>
               )}
             </div>

             <div className="space-y-1">
               <label
                 htmlFor="province"
                 className="block text-sm font-semibold ml-1"
                 style={{ color: "var(--color-secondary-text)" }}
               >
                 Provincia (Tarifa Fija)
               </label>
               <div className="relative">
                 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-70" />
                  <select
                    id="province"
                    {...register("province", { required: "Obligatoria" })}
                    className={`${inputClasses} appearance-none ${errors.province ? 'border-red-400 bg-red-50/20' : 'bg-gray-50/50 hover:bg-gray-50 focus:bg-white'} focus-within:ring-2`}
                    style={{ 
                      color: "var(--color-primary-text)", 
                      borderColor: errors.province ? undefined : "var(--color-border, #f3f4f6)",
                      outlineColor: "var(--color-primary-bg)"
                    }}
                  >
                    {Object.keys(provinceRates).length === 0 ? (
                      <option value="">Cargando tarifas...</option>
                    ) : (
                      Object.keys(provinceRates).map((prov) => (
                        <option key={prov} value={prov}>
                          {prov} (${provinceRates[prov].toLocaleString('es-AR')})
                        </option>
                      ))
                    )}
                  </select>
               </div>
               {errors.province && (
                 <p className="text-red-500 text-xs font-medium mt-1 ml-1 animate-in slide-in-from-top-1">
                   {errors.province.message}
                 </p>
               )}
             </div>

             <div className="space-y-1">
               <label
                 htmlFor="postalCode"
                 className="block text-sm font-semibold ml-1"
                 style={{ color: "var(--color-secondary-text)" }}
               >
                 Cód. Postal
               </label>
               <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-70" />
                  <input
                   id="postalCode"
                   type="text"
                   placeholder="Ej: 1424"
                   {...register("postalCode", {
                     required: "Requerido",
                     pattern: { value: /^[0-9A-Za-z\s-]{3,10}$/, message: "Inválido" },
                   })}
                   className={`${inputClasses} ${errors.postalCode ? 'border-red-400 bg-red-50/20' : 'bg-gray-50/50 hover:bg-gray-50 focus:bg-white'} focus-within:ring-2`}
                   style={{ 
                     color: "var(--color-primary-text)", 
                     borderColor: errors.postalCode ? undefined : "var(--color-border, #f3f4f6)",
                     outlineColor: "var(--color-primary-bg)"
                   }}
                 />
               </div>
               {errors.postalCode && (
                 <p className="text-red-500 text-xs font-medium mt-1 ml-1 animate-in slide-in-from-top-1">
                   {errors.postalCode.message}
                 </p>
               )}
             </div>
           </div>
        </div>
      )}

      {/* Teléfono */}
      <div className="space-y-1">
        <label
          htmlFor="phone"
          className="block text-sm font-semibold ml-1"
          style={{ color: "var(--color-secondary-text)" }}
        >
          Teléfono / Celular
        </label>
        <div className="relative">
          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-70" />
          <input
            id="phone"
            type="tel"
            placeholder="+54 9 11 1234-5678"
            {...register("phone", {
              required: "Teléfono obligatorio",
              pattern: { value: /^\+?[\d\s-]{7,20}$/, message: "Número inválido" },
            })}
            className={`${inputClasses} ${errors.phone ? 'border-red-400 bg-red-50/20' : 'bg-gray-50/50 hover:bg-gray-50 focus:bg-white'} focus-within:ring-2`}
            style={{ 
              color: "var(--color-primary-text)", 
              borderColor: errors.phone ? undefined : "var(--color-border, #f3f4f6)",
              outlineColor: "var(--color-primary-bg)"
            }}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs font-medium mt-1 ml-1 animate-in slide-in-from-top-1">{errors.phone.message}</p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer group w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            color: "var(--color-tertiary-text, #fff)",
            backgroundColor: "var(--color-primary-bg, var(--bg1))",
          }}
        >
          Continuar al Pago
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
