"use client";

import React, { useState, useEffect } from "react";
import { getCart, clearCart } from "@/utils/CartUtils";
import ShippingForm, { ShippingData } from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import ReviewOrder from "./ReviewOrder";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "mercadopago" | "local" | "transfer"
  >("mercadopago");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (open) {
      setCartItems(getCart());
      setStep(1);
    }
  }, [open]);

  const handleShipping = (data: ShippingData) => {
    setShippingData(data);
    setStep(2);
  };

  const handlePayment = (method: "mercadopago" | "local" | "transfer") => {
    setPaymentMethod(method);
    setStep(3);
  };

  const handleConfirm = async () => {
    try {
      // 1. Crear orden en tu backend
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingData, paymentMethod, cartItems }),
      });

      if (!orderRes.ok) {
        const errorText = await orderRes.text();
        console.error("Error al crear la orden:", {
          status: orderRes.status,
          statusText: orderRes.statusText,
          body: errorText,
        });
        alert(`Error al crear la orden:\n${errorText}`);
        return;
      }

      const { id: orderId } = await orderRes.json();

      // 2. Si el método es Mercado Pago, crear preferencia y redirigir
      if (paymentMethod === "mercadopago") {
        const prefRes = await fetch("/api/payments/mercadopago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, cartItems }),
        });

        if (!prefRes.ok) {
          console.error(
            "Error creando preferencia MercadoPago",
            await prefRes.text()
          );
          return;
        }

        const { init_point } = await prefRes.json();
        // Redirigir al Checkout Pro
        window.location.href = init_point;
        return;
      }

      // 3. Otros métodos de pago: marcar la orden como pagada directamente
      const paymentRes = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: "paid" }),
      });

      if (!paymentRes.ok) {
        console.error("Error al notificar el pago", await paymentRes.text());
      }

      clearCart();
      onClose();
      window.location.href = "/thank-you";
    } catch (error) {
      console.error("Error en el proceso de checkout:", error);
    }
  };

  if (!open) return null;

  const labels = ["Envío", "Pago", "Resumen"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 opacity-50"
        style={{ background: "var(--color-tertiary-bg)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto
        "
        style={{ background: "var(--bgweb)" }}
      >
        <button
          onClick={onClose}
          className=" cursor-pointer absolute top-3 right-3 text-2xl leading-none"
          style={{ color: "var(--color-primary-text)" }}
        >
          &times;
        </button>

        {/* Stepper */}
        <div className="flex justify-between mb-6">
          {labels.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= step;

            const circleStyle: React.CSSProperties = isActive
              ? {
                  background: "var(--bgweb)",
                  borderColor: "var(--color-primary-bg)",
                }
              : {
                  background: "var(--white, #fff)",
                  borderColor: "var(--gray-400, #9ca3af)",
                };

            const numberStyle: React.CSSProperties = isActive
              ? { color: "var(--color-primary-bg)" }
              : { color: "var(--gray-400, #9ca3af)" };

            const labelStyle: React.CSSProperties = isActive
              ? { color: "var(--color-primary-bg)" }
              : { color: "var(--gray-400, #9ca3af)" };

            return (
              <div key={label} className="flex-1 text-center">
                <div
                  className="mx-auto w-8 h-8 rounded-full border-2 flex items-center justify-center"
                  style={circleStyle}
                >
                  <span className="font-semibold" style={numberStyle}>
                    {stepNumber}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium" style={labelStyle}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Botón volver */}
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="cursor-pointer text-sm text-gray-600 hover:underline mb-4"
          >
            ← Volver
          </button>
        )}

        {/* Contenido por paso */}
        {step === 1 && <ShippingForm onNext={handleShipping} />}
        {step === 2 && <PaymentForm onNext={handlePayment} />}
        {step === 3 && shippingData && (
          <ReviewOrder
            shipping={shippingData}
            cartItems={cartItems}
            paymentMethod={paymentMethod}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </div>
  );
}
