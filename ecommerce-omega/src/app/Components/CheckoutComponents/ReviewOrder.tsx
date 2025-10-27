"use client";

import React from "react";
import { ShippingData } from "./ShippingForm";

interface Props {
  shipping: ShippingData;
  paymentMethod: "mercadopago" | "local" | "transfer";
  cartItems: { id: string; title: string; price: number; quantity: number }[];
  onConfirm: () => void;
}

export default function ReviewOrder({
  shipping,
  paymentMethod,
  cartItems,
  onConfirm,
}: Props) {
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const paymentLabels: Record<Props["paymentMethod"], string> = {
    mercadopago: "MercadoPago",
    local: "Pago en local",
    transfer: "Transferencia bancaria",
  };

  return (
    <div
      className=" p-6 rounded-md shadow-md space-y-6"
      style={{ background: "var(--bgweb)" }}
    >
      {/* Envío */}
      <section>
        <h3
          className="text-lg font-semibold  border-b pb-2 mb-2"
          style={{ color: "var(--color-primary-text)" }}
        >
          Datos de envío
        </h3>
        <p style={{ color: "var(--color-secondary-text)" }}>
          {shipping.firstName} {shipping.lastName}
        </p>
        <p style={{ color: "var(--color-secondary-text)" }}>
          {shipping.address}, {shipping.city}, {shipping.province}, CP{" "}
          {shipping.postalCode}
        </p>
        <p style={{ color: "var(--color-secondary-text)" }}>
          Tel: {shipping.phone}
        </p>
      </section>

      {/* Pago */}
      <section>
        <h3
          className="text-lg font-semibold  border-b pb-2 mb-2"
          style={{ color: "var(--color-primary-text)" }}
        >
          Método de pago
        </h3>
        <p style={{ color: "var(--color-secondary-text)" }}>
          {paymentLabels[paymentMethod]}
        </p>
      </section>

      {/* Productos */}
      <section>
        <h3
          className="text-lg font-semibold  border-b pb-2 mb-2"
          style={{ color: "var(--color-primary-text)" }}
        >
          Productos
        </h3>
        <ul className="space-y-3">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between "
              style={{ color: "var(--color-secondary-text)" }}
            >
              <span>
                {item.title} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div
          className="flex justify-between font-bold  border-t pt-4 mt-4"
          style={{ color: "var(--color-primary-text)" }}
        >
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </section>

      {/* Confirmar */}
      <button
        onClick={onConfirm}
        className="cursor-pointer w-full font-medium py-2 rounded-md transition"
        style={{
          color: "var(--color-tertiary-text)",
          background: "var(--color-primary-bg)",
        }}
      >
        Confirmar compra
      </button>
    </div>
  );
}
