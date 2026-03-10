"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CreditCard, Store, Landmark, ArrowRight, Copy, Check, Tag } from "lucide-react";

export type PaymentData = {
  method: "local" | "transfer" | "mercadopago";
  transferReference?: string;
};
interface Props {
  onNext: (method: PaymentData["method"]) => void;
}

interface TransferConfig {
  discount_enabled?: boolean;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  cbu?: string;
  alias?: string;
  bank_name?: string;
  account_holder?: string;
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
  const [mounted, setMounted] = useState(false);
  const [transferConfig, setTransferConfig] = useState<TransferConfig | null>(null);
  const [copied, setCopied] = useState<"cbu" | "alias" | null>(null);

  useEffect(() => setMounted(true), []);

  // Load transfer config from site settings
  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg?.payment_config?.transfer) {
          setTransferConfig(cfg.payment_config.transfer);
        }
      })
      .catch(() => {});
  }, []);

  const onSubmit = (data: PaymentData) => {
    onNext(data.method);
  };

  const handleCopy = (text: string, field: "cbu" | "alias") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
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

  const hasDiscount =
    transferConfig?.discount_enabled &&
    transferConfig.discount_value &&
    transferConfig.discount_value > 0;

  const discountLabel =
    transferConfig?.discount_type === "percentage"
      ? `${transferConfig.discount_value}% de descuento`
      : `$${transferConfig?.discount_value?.toLocaleString("es-AR")} de descuento`;

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
            const showTransferBadge = option.id === "transfer" && hasDiscount;

            return (
              <div
                key={option.id}
                onClick={() =>
                  setValue("method", option.id as PaymentData["method"], {
                    shouldValidate: true,
                  })
                }
                className={`
                  relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300
                  flex flex-col items-center text-center gap-3 overflow-hidden
                  ${
                    isSelected
                      ? "shadow-md transform -translate-y-1"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50/20 hover:bg-gray-50 hover:-translate-y-0.5 shadow-sm"
                  }
                `}
                style={
                  isSelected
                    ? {
                        borderColor: "var(--color-primary-bg)",
                        backgroundColor: "var(--color-primary-bg)",
                      }
                    : {}
                }
              >
                {/* Discount badge */}
                {showTransferBadge && (
                  <div
                    className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm"
                    style={{
                      backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : "var(--color-primary-bg)",
                      color: isSelected ? "#fff" : "var(--color-tertiary-text, #fff)",
                    }}
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {discountLabel}
                  </div>
                )}

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
                  style={
                    isSelected
                      ? { backgroundColor: "var(--color-tertiary-text, #fff)" }
                      : {}
                  }
                >
                  {isSelected && (
                    <div
                      className="w-2 h-2 rounded-full animate-in zoom-in"
                      style={{ backgroundColor: "var(--color-primary-bg)" }}
                    />
                  )}
                </div>

                <div
                  className={`p-3 rounded-full text-white shadow-inner ${
                    isSelected ? "opacity-90 grayscale" : "opacity-100"
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? "var(--color-tertiary-text, #fff)"
                      : "var(--color-primary-bg)",
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={isSelected ? { color: "var(--color-primary-bg)" } : {}}
                  />
                </div>

                <div className="relative z-10 w-full mt-1">
                  <span
                    className="block font-bold text-sm mb-1 line-clamp-1"
                    style={{
                      color: isSelected
                        ? "var(--color-tertiary-text, #fff)"
                        : "var(--color-primary-text)",
                    }}
                  >
                    {option.label}
                  </span>
                  <span
                    className="block text-xs leading-tight"
                    style={{
                      color: isSelected
                        ? "var(--color-tertiary-text, #fff)"
                        : "var(--color-secondary-text)",
                      opacity: isSelected ? 0.9 : 1,
                    }}
                  >
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

      {/* Transfer expanded section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          selectedMethod === "transfer" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-2 space-y-4">
          {/* Discount banner */}
          {hasDiscount && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border font-medium text-sm animate-in fade-in"
              style={{
                backgroundColor: "var(--color-primary-bg)",
                borderColor: "var(--color-primary-bg)",
                color: "var(--color-tertiary-text, #fff)",
              }}
            >
              <Tag className="w-5 h-5 flex-shrink-0" />
              <span>
                🎉 <strong>{discountLabel}</strong> pagando con transferencia bancaria
              </span>
            </div>
          )}

          {/* Bank info card */}
          {(transferConfig?.cbu || transferConfig?.alias || transferConfig?.bank_name) && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <h4
                className="text-sm font-bold flex items-center gap-2"
                style={{ color: "var(--color-primary-text)" }}
              >
                <Landmark className="w-4 h-4" style={{ color: "var(--color-primary-bg)" }} />
                Datos para transferir
              </h4>

              <div className="space-y-2 text-sm" style={{ color: "var(--color-secondary-text)" }}>
                {transferConfig?.bank_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Banco</span>
                    <span className="font-semibold" style={{ color: "var(--color-primary-text)" }}>
                      {transferConfig.bank_name}
                    </span>
                  </div>
                )}
                {transferConfig?.account_holder && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Titular</span>
                    <span className="font-semibold" style={{ color: "var(--color-primary-text)" }}>
                      {transferConfig.account_holder}
                    </span>
                  </div>
                )}
                {transferConfig?.cbu && (
                  <div className="flex justify-between items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium uppercase tracking-wide">CBU</span>
                      <span className="font-mono text-xs font-semibold" style={{ color: "var(--color-primary-text)" }}>
                        {transferConfig.cbu}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(transferConfig.cbu!, "cbu")}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        backgroundColor: copied === "cbu" ? "#d1fae5" : "var(--color-primary-bg)",
                        color: copied === "cbu" ? "#065f46" : "var(--color-tertiary-text, #fff)",
                      }}
                    >
                      {copied === "cbu" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === "cbu" ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>
                )}
                {transferConfig?.alias && (
                  <div className="flex justify-between items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium uppercase tracking-wide">Alias</span>
                      <span className="font-mono text-sm font-bold" style={{ color: "var(--color-primary-text)" }}>
                        {transferConfig.alias}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(transferConfig.alias!, "alias")}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        backgroundColor: copied === "alias" ? "#d1fae5" : "var(--color-primary-bg)",
                        color: copied === "alias" ? "#065f46" : "var(--color-tertiary-text, #fff)",
                      }}
                    >
                      {copied === "alias" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied === "alias" ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reference field */}
          <div>
            <label
              htmlFor="transferReference"
              className="block text-sm font-semibold ml-1 mb-2"
              style={{ color: "var(--color-secondary-text)" }}
            >
              Referencia del comprobante <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-70" />
              <input
                id="transferReference"
                type="text"
                placeholder="Ej: TRX-12345678"
                {...register("transferReference", {
                  required:
                    selectedMethod === "transfer"
                      ? "Referencia obligatoria si pagas con transferencia"
                      : false,
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
                className={`w-full border-2 border-gray-100 bg-gray-50/50 rounded-xl px-4 py-3 pl-11 outline-none transition-all ${
                  errors.transferReference
                    ? "border-red-400 bg-red-50/20"
                    : "focus:bg-white"
                } focus-within:ring-2`}
                style={{
                  color: "var(--color-primary-text)",
                  borderColor: errors.transferReference
                    ? undefined
                    : "var(--color-border, #f3f4f6)",
                  outlineColor: "var(--color-primary-bg)",
                }}
              />
            </div>
            {errors.transferReference && (
              <p className="text-red-500 text-xs font-medium mt-2 ml-1">
                {errors.transferReference.message}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5 ml-1">
              Ingresá el número de comprobante de tu transferencia para que podamos verificarla rápidamente.
            </p>
          </div>
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
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "var(--color-secondary-bg)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "var(--color-primary-bg, var(--bg1))")
          }
        >
          Ir al resumen
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
