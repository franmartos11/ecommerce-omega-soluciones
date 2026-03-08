"use client";

import React from "react";
import { ShippingData } from "./ShippingForm";
import { CreditCard, MapPin, Package, CheckCircle2 } from "lucide-react";

interface Props {
  shipping: ShippingData;
  paymentMethod: "mercadopago" | "local" | "transfer";
  cartItems: { id: string; title: string; price: number; quantity: number }[];
  shippingCost: number;
  onConfirm: (couponData?: { code: string; amount: number }) => void;
}

export default function ReviewOrder({
  shipping,
  paymentMethod,
  cartItems,
  shippingCost,
  onConfirm,
}: Props) {
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; discount_type: string; discount_value: number } | null>(null);
  const [couponError, setCouponError] = React.useState("");
  const [validating, setValidating] = React.useState(false);

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === "percentage") {
      discountAmount = subtotal * (appliedCoupon.discount_value / 100);
    } else {
      discountAmount = appliedCoupon.discount_value;
    }
  }

  const total = Math.max(0, subtotal - discountAmount) + shippingCost;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidating(true);
    setCouponError("");
    try {
      const res = await fetch("/api/checkout/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Cupón inválido");
      }
      setAppliedCoupon(data);
    } catch (err: unknown) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    } finally {
      setValidating(false);
    }
  };

  const paymentLabels: Record<Props["paymentMethod"], string> = {
    mercadopago: "Mercado Pago",
    local: "Pago en local",
    transfer: "Transferencia bancaria",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Envío */}
        <section className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/50">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--color-primary-text)" }}>
              <MapPin className="w-4 h-4" style={{ color: "var(--color-primary-bg, #3b82f6)" }} />
              Datos de envío
            </h3>
            <button className="text-xs font-medium hover:underline opacity-80" style={{ color: "var(--color-primary-bg)" }}>Editar</button>
          </div>
          <div className="space-y-1 text-sm" style={{ color: "var(--color-secondary-text)" }}>
            <p className="font-semibold" style={{ color: "var(--color-primary-text)" }}>
              {shipping.firstName} {shipping.lastName}
            </p>
            <p className="truncate" title={`${shipping.address}, ${shipping.city}, ${shipping.province}`}>
              {shipping.address}, {shipping.city}
            </p>
            <p>{shipping.province}, CP {shipping.postalCode}</p>
            <p className="pt-1 text-xs">{shipping.phone}</p>
          </div>
        </section>

        {/* Pago */}
        <section className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/50">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--color-primary-text)" }}>
              <CreditCard className="w-4 h-4" style={{ color: "var(--color-primary-bg, #10b981)" }} />
              Método de pago
            </h3>
            <button className="text-xs font-medium hover:underline opacity-80" style={{ color: "var(--color-primary-bg)" }}>Editar</button>
          </div>
          <div className="h-full flex items-center mb-4">
            <p className="font-medium text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm" style={{ color: "var(--color-primary-text)" }}>
              {paymentLabels[paymentMethod]}
            </p>
          </div>
        </section>
      </div>

      {/* Productos */}
      <section className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--color-primary-text)" }}>
            <Package className="w-4 h-4" style={{ color: "var(--color-primary-bg, #f97316)" }} />
            Tus productos
          </h3>
          <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-primary-bg)", color: "var(--color-tertiary-text, #fff)", opacity: 0.9 }}>
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
          </span>
        </div>
        
        <ul className="divide-y divide-gray-50 max-h-48 overflow-y-auto p-4 custom-scrollbar">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "var(--color-primary-bg)", color: "var(--color-tertiary-text, #fff)", opacity: 0.15 }}>
                   <span style={{ color: "var(--color-primary-bg)", opacity: 1 }}>{item.quantity}</span>
                </span>
                <span className="text-sm font-medium truncate" style={{ color: "var(--color-primary-text)" }}>
                  {item.title}
                </span>
              </div>
              <span className="font-semibold text-sm flex-shrink-0 ml-4" style={{ color: "var(--color-primary-text)" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-3">
          {/* Formulario Cupón */}
          {!appliedCoupon ? (
            <div className="flex gap-2 items-center">
              <input 
                type="text"
                placeholder="Código de descuento"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
              />
              <button 
                onClick={handleApplyCoupon}
                disabled={validating || !couponCode}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 disabled:opacity-50 transition"
              >
                {validating ? "Validando..." : "Aplicar"}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm">
              <span className="font-semibold flex items-center gap-1">
                 <CheckCircle2 className="w-4 h-4 text-green-600" />
                 Cupón aplicado: <span className="font-mono">{appliedCoupon.code}</span>
              </span>
              <button onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} className="text-red-500 font-bold hover:underline">
                 Quitar
              </button>
            </div>
          )}
          {couponError && <p className="text-red-500 text-xs font-medium">{couponError}</p>}

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between items-center text-sm font-semibold text-green-600">
                <span>Descuento ({appliedCoupon.code}):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Envío:</span>
              <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Gratis'}</span>
            </div>

            <div className="flex justify-between items-center text-lg font-bold mt-2" style={{ color: "var(--color-primary-text)" }}>
              <span>Total a pagar:</span>
              <span className="text-xl">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmar */}
      <div className="pt-2">
        <button
          onClick={() => onConfirm(appliedCoupon ? { code: appliedCoupon.code, amount: discountAmount } : undefined)}
          className="cursor-pointer group w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-green-500/20"
          style={{
            color: "var(--color-tertiary-text, #fff)",
            backgroundColor: "var(--color-primary-bg, #10B981)", 
          }}
        >
          <CheckCircle2 className="w-6 h-6" />
          Confirmar Compra
        </button>
        <p className="text-center text-xs mt-3 text-gray-400">
          Al confirmar, aceptas nuestros términos y condiciones.
        </p>
      </div>
    </div>
  );
}
