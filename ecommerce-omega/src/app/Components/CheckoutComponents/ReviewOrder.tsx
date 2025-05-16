'use client';

import React from 'react';
import { ShippingData } from './ShippingForm';

interface Props {
  shipping: ShippingData;
  paymentMethod: 'mercadopago' | 'local' | 'transfer';
  cartItems: { id: string; title: string; price: number; quantity: number }[];
  onConfirm: () => void;
}

export default function ReviewOrder({ shipping, paymentMethod, cartItems, onConfirm }: Props) {
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const paymentLabels: Record<Props['paymentMethod'], string> = {
    mercadopago: 'MercadoPago',
    local: 'Pago en local',
    transfer: 'Transferencia bancaria',
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md space-y-6">
      {/* Envío */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Datos de envío</h3>
        <p className="text-gray-700">{shipping.firstName} {shipping.lastName}</p>
        <p className="text-gray-700">{shipping.address}, {shipping.city}, {shipping.province}, CP {shipping.postalCode}</p>
        <p className="text-gray-700">Tel: {shipping.phone}</p>
      </section>

      {/* Pago */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Método de pago</h3>
        <p className="text-gray-700">{paymentLabels[paymentMethod]}</p>
      </section>

      {/* Productos */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Productos</h3>
        <ul className="space-y-3">
          {cartItems.map(item => (
            <li key={item.id} className="flex justify-between text-gray-700">
              <span>{item.title} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold text-gray-900 border-t pt-4 mt-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </section>

      {/* Confirmar */}
      <button
        onClick={onConfirm}
        className="cursor-pointer w-full bg-bg1 hover:bg-bg2 text-white font-medium py-2 rounded-md transition"
      >
        Confirmar compra
      </button>
    </div>
  );
}
