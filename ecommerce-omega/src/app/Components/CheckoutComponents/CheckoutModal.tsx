'use client';

import React, { useState, useEffect } from 'react';
import { getCart, clearCart } from '@/utils/CartUtils';
import ShippingForm, { ShippingData } from './ShippingForm';
import PaymentForm from './PaymentForm';
import ReviewOrder from './ReviewOrder';

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
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'local' | 'transfer'>('mercadopago');
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

  const handlePayment = (method: 'mercadopago' | 'local' | 'transfer') => {
    setPaymentMethod(method);
    setStep(3);
  };

  const handleConfirm = async () => {
    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingData, paymentMethod, cartItems }),
      });

      if (!orderRes.ok) {
        console.error('Error al crear la orden', await orderRes.text());
        return;
      }

      const { id: orderId } = await orderRes.json();

      const paymentRes = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'paid' }),
      });

      if (!paymentRes.ok) {
        console.error('Error al notificar el pago', await paymentRes.text());
      }

      clearCart();
      onClose();
      window.location.href = '/thank-you';
    } catch (error) {
      console.error('Error en el proceso de checkout:', error);
    }
  };

  if (!open) return null;

  const labels = ['Envío', 'Pago', 'Resumen'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      {/* Modal */}
      <div
        className="
          relative bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto
        "
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          &times;
        </button>

        {/* Stepper */}
        <div className="flex justify-between mb-6">
          {labels.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= step;
            return (
              <div key={label} className="flex-1 text-center">
                <div
                  className={`mx-auto w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    isActive ? 'border-bg2 bg-bg1' : 'border-gray-300 bg-white'
                  }`}
                >
                  <span className={`${isActive ? 'text-text2' : 'text-gray-400'} font-semibold`}>
                    {stepNumber}
                  </span>
                </div>
                <p className={`${isActive ? 'text-text1' : 'text-gray-400'} mt-2 text-sm font-medium`}>
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
            className="text-sm text-gray-600 hover:underline mb-4"
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
