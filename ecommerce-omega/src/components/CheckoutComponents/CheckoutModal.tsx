"use client";

import React, { useState, useEffect } from "react";
import { getCart, clearCart } from "@/utils/CartUtils";
import ShippingForm, { ShippingData } from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import ReviewOrder from "./ReviewOrder";
import { X, ArrowLeft, Check } from "lucide-react";

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
  variantId?: string;
  productId?: string;
};

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "mercadopago" | "local" | "transfer"
  >("mercadopago");
  const [transferReference, setTransferReference] = useState<string | undefined>();
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [provinceRates, setProvinceRates] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open) {
      setCartItems(getCart());
      setStep(1);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      fetchRates();
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/shipping");
      if (res.ok) {
        const rates = await res.json();
        setProvinceRates(rates);
      }
    } catch (e) {
      console.error("Failed to fetch shipping rates", e);
    }
  };

  const handleShipping = (data: ShippingData) => {
    setShippingData(data);
    setStep(2);
  };

  const handlePayment = (method: "mercadopago" | "local" | "transfer", reference?: string, receiptUrl?: string) => {
    setPaymentMethod(method);
    setTransferReference(reference);
    setReceiptUrl(receiptUrl);
    setStep(3);
  };

  const handleConfirm = async (couponData?: { code: string; amount: number }) => {
    try {
      // Calcular costo de envío dinámico
      const shippingCost =
        shippingData?.deliveryMethod === "shipping" && shippingData.province
          ? provinceRates[shippingData.province] || 0
          : 0;

      // 1. Obtener email del usuario si está logueado
      let userEmail = null;
      try {
        const storedUser = localStorage.getItem("userLoggedIn");
        if (storedUser) {
          userEmail = JSON.parse(storedUser).email;
        }
      } catch (e) {
        console.warn("Could not parse user logged in data", e);
      }

      // 2. Crear orden en tu backend
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingData, paymentMethod, reference: transferReference, receiptUrl, cartItems, userEmail, coupon: couponData, shippingCost }),
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

      // Send order confirmation email (non-blocking)
      try {
        const emailTo = userEmail;
        if (emailTo) {
          fetch("/api/email/send-order-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: emailTo,
              order: {
                id: orderId,
                items: cartItems.map((i) => ({ title: i.title, price: i.price, quantity: i.quantity })),
                total: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0) - (couponData?.amount || 0) + (shippingData?.deliveryMethod === "shipping" && shippingData.province ? provinceRates[shippingData.province] || 0 : 0),
                shipping: shippingData,
                paymentMethod,
                couponDiscount: couponData?.amount,
              },
            }),
          }).catch((e) => console.warn("Email send failed (non-blocking):", e));
        }
      } catch (e) {
        console.warn("Email preparation failed:", e);
      }

      // 2. Si el método es Mercado Pago, crear preferencia y redirigir
      if (paymentMethod === "mercadopago") {
        const prefRes = await fetch("/api/payments/mercadopago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, cartItems, coupon: couponData, shippingCost }),
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
      // Redirect dynamically to the specific receipt page
      window.location.href = `/checkout/success/${orderId}`;
    } catch (error) {
      console.error("Error en el proceso de checkout:", error);
    }
  };

  if (!open) return null;

  const labels = ["Envío", "Pago", "Confirmación"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Overlay with blur effect */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="
          relative w-full max-w-2xl mx-auto rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300
          flex flex-col max-h-[90vh] sm:max-h-[85vh]
        "
        style={{ background: "var(--bgweb)" }}
      >
        {/* Header Ribbon & Close Button */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-primary-text)" }}>
            Finalizar Compra
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": "var(--color-primary-bg)" } as React.CSSProperties}
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 sm:px-10 pt-5 pb-8 mb-2 bg-gray-50/50 border-y border-gray-100">
          <div className="relative flex justify-between items-center max-w-sm mx-auto">
            {/* Lines Container */}
            <div className="absolute top-1/2 left-5 right-5 h-1 -translate-y-1/2 z-0">
              {/* Background line connecting the steps */}
              <div className="absolute inset-0 bg-gray-200 rounded-full" />
              
              {/* Active progress line */}
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${((step - 1) / (labels.length - 1)) * 100}%`, backgroundColor: "var(--color-primary-bg, var(--bg1))" }}
              />
            </div>

            {labels.map((label, index) => {
              const stepNumber = index + 1;
              const isPast = stepNumber < step;
              const isActive = stepNumber === step;
              const isFuture = stepNumber > step;

              return (
                <div key={label} className="relative z-10 flex justify-center items-center w-10">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                      ${isPast ? "text-white shadow-md scale-100" : ""}
                      ${isActive ? "text-white ring-4 scale-110 shadow-lg" : ""}
                      ${isFuture ? "bg-white text-gray-400 border-2 border-gray-200" : ""}
                    `}
                    style={
                      isPast || isActive 
                        ? { 
                            backgroundColor: "var(--color-primary-bg, var(--bg1))",
                            color: "var(--color-tertiary-text, #fff)",
                            "--tw-ring-color": "var(--color-primary-bg)",
                            "--tw-ring-opacity": "0.3"
                          } as React.CSSProperties 
                        : {}
                    }
                  >
                    {isPast ? <Check className="w-5 h-5" /> : stepNumber}
                  </div>
                  <span 
                    className={`absolute top-full mt-2 text-xs font-semibold whitespace-nowrap transition-colors duration-300
                      ${isPast ? "text-gray-700" : "text-gray-400"}
                    `}
                    style={isActive ? { color: "var(--color-primary-bg)" } : {}}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Scrollable Area */}
        <div className="flex-grow overflow-y-auto px-6 sm:px-10 py-6 custom-scrollbar">
          
          {/* Botón volver interno (solo visible si > 1) */}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="group flex items-center gap-1.5 text-sm font-semibold mb-6 transition-colors hover:opacity-80"
              style={{ color: "var(--color-primary-bg)" }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver atrás
            </button>
          )}

          <div className="pb-4">
            {step === 1 && <ShippingForm onNext={handleShipping} provinceRates={provinceRates} />}
            {step === 2 && (
              <PaymentForm 
                onNext={handlePayment} 
                subtotal={cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                shippingCost={
                  shippingData?.deliveryMethod === "shipping" && shippingData.province
                    ? provinceRates[shippingData.province] || 0
                    : 0
                }
              />
            )}
            {step === 3 && shippingData && (
              <ReviewOrder
                shipping={shippingData}
                cartItems={cartItems}
                paymentMethod={paymentMethod}
                onConfirm={handleConfirm}
                shippingCost={
                  shippingData.deliveryMethod === "shipping" && shippingData.province
                    ? provinceRates[shippingData.province] || 0
                    : 0
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
