"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CreditCard, Store, Landmark, ArrowRight } from "lucide-react";

export type PaymentData = {
  method: "local" | "transfer" | "mercadopago";
  transferReference?: string;
};
interface Props {
  onNext: (method: PaymentData["method"]) => void;
}

export default function PaymentForm({ onNext }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentData>({ defaultValues: { method: "mercadopago" } });

  const selectedMethod = watch("method");
  // Para animaciones client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onSubmit = (data: PaymentData) => {
    onNext(data.method);
  };

  const paymentOptions = [
    {
      id: "mercadopago",
      label: "Mercado Pago",
      description: "Paga de forma rápida y segura",
      icon: CreditCard,
    },
    {
      id: "transfer",
      label: "Transferencia B.",
      description: "Envía dinero desde tu banco",
      icon: Landmark,
    },
    {
      id: "local",
      label: "Pago en Local",
      description: "Paga al retirar tu pedido",
      icon: Store,
    },
  ];

  if (!mounted) return null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
    >
      <div className="space-y-1">
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--color-primary-text)" }}
        >
          ¿Cómo prefieres pagar?
        </h3>
        <p className="text-sm pb-4" style={{ color: "var(--color-secondary-text)" }}>
          Selecciona un método de pago. Tu conexión es segura.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {paymentOptions.map((option) => {
            const isSelected = selectedMethod === option.id;
            const Icon = option.icon;

            return (
              <div
                key={option.id}
                onClick={() => setValue("method", option.id as PaymentData["method"], { shouldValidate: true })}
                className={`
                  relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300
                  flex flex-col items-center text-center gap-3 overflow-hidden
                  ${
                    isSelected
                      ? "shadow-md transform -translate-y-1"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50/20 hover:bg-gray-50 hover:-translate-y-0.5 shadow-sm"
                  }
                `}
                style={isSelected ? { 
                  borderColor: "var(--color-primary-bg)",
                  backgroundColor: "var(--color-primary-bg)"
                } : {}}
              >
                {/* Active Backdrop (very low opacity primary color) */}
                {isSelected && (
                   <div 
                     className="absolute inset-0 opacity-10" 
                     style={{ backgroundColor: "var(--color-primary-text, #000)" }} 
                   />
                )}
                
                {/* Hidden Radio */}
                <input
                  type="radio"
                  id={option.id}
                  value={option.id}
                  {...register("method", { required: true })}
                  className="sr-only"
                />
                
                {/* Check indicator */}
                <div 
                  className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm
                    ${isSelected ? "border-transparent" : "border-gray-300"}
                  `}
                  style={isSelected ? { backgroundColor: "var(--color-tertiary-text, #fff)" } : {}}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full animate-in zoom-in" style={{ backgroundColor: "var(--color-primary-bg)" }} />}
                </div>

                <div 
                  className={`p-3 rounded-full text-white shadow-inner ${isSelected ? 'opacity-90 grayscale' : 'opacity-100'}`}
                  style={{ backgroundColor: isSelected ? "var(--color-tertiary-text, #fff)" : "var(--color-primary-bg)" }}
                >
                  <Icon className="w-6 h-6" style={isSelected ? { color: "var(--color-primary-bg)" } : {}} />
                </div>
                
                <div className="relative z-10 w-full mt-1">
                  <span className="block font-bold text-sm mb-1 line-clamp-1" style={{ color: isSelected ? "var(--color-tertiary-text, #fff)" : "var(--color-primary-text)" }}>
                    {option.label}
                  </span>
                  <span className="block text-xs leading-tight" style={{ color: isSelected ? "var(--color-tertiary-text, #fff)" : "var(--color-secondary-text)", opacity: isSelected ? 0.9 : 1 }}>
                    {option.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {errors.method && (
          <p className="text-red-500 text-sm font-medium mt-2 animate-in slide-in-from-top-1 text-center">
            Debes seleccionar un método de pago
          </p>
        )}
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${selectedMethod === 'transfer' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-4 pb-2">
          <label
            htmlFor="transferReference"
            className="block text-sm font-semibold ml-1 mb-2"
            style={{
              color: "var(--color-secondary-text)",
            }}
          >
            Referencia de transferencia (Clave del comprobante)
          </label>
          <div className="relative">
             <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-70" />
             <input
              id="transferReference"
              type="text"
              placeholder="Ej: TRX-12345678"
              {...register("transferReference", {
                required: selectedMethod === "transfer" ? "Referencia obligatoria si pagas con transferencia" : false,
                minLength: { value: 5, message: "Mínimo 5 caracteres" },
              })}
              className={`w-full border-2 border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3 pl-11 outline-none transition-all ${errors.transferReference ? 'border-red-400 bg-red-50/20' : 'focus:bg-white'} focus-within:ring-2`}
              style={{
                color: "var(--color-primary-text)",
                borderColor: errors.transferReference ? undefined : "var(--color-border, #f3f4f6)",
                outlineColor: "var(--color-primary-bg)"
              }}
            />
          </div>
          {errors.transferReference && (
            <p className="text-red-500 text-xs font-medium mt-2 ml-1">
              {errors.transferReference.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 mt-6 relative z-10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer group w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            color: "var(--color-tertiary-text, #fff)",
            backgroundColor: "var(--color-primary-bg, var(--bg1))",
          }}
        >
          Ir al resumen
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
