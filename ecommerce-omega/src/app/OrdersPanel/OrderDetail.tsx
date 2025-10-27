import React from "react";

type Props = {
  order: {
    id: string;
    date: string;
    total: number;
    status: string;
    items: { id: string; title: string; price: number; quantity: number }[];
    shipping: {
      firstName: string; lastName: string; address: string; city: string;
      province: string; postalCode: string; phone: string;
    };
    paymentMethod: "mercadopago" | "local" | "transfer";
  };
  onClose: () => void;
};

const paymentLabels = {
  mercadopago: "MercadoPago",
  local: "Pago en local",
  transfer: "Transferencia bancaria",
};

export default function OrderDetail({ order, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4"
      // Overlay SEMI transparente (neutral, no el color de marca)
      style={{ background: "var(rgba(0,0,0,.45))" }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
        // Panel (superficie neutra)
        style={{
          background: "var(--bgweb)",
          color: "var(--color-primary-text)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-2xl transition-opacity hover:opacity-80"
          style={{ color: "var(--color-secondary-text)" }}
          aria-label="Cerrar"
        >
          &times;
        </button>

        <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--color-primary-text)" }}>
          Orden #{order.id.slice(0, 6)}...
        </h3>

        <p className="text-sm mb-4" style={{ color: "var(--color-secondary-text)" }}>
          {new Date(order.date).toLocaleString()} —{" "}
          <span className="capitalize font-semibold"
                // Acento (azul/naranja según tu tema)
                style={{ color: "var(--color-secondary-text)" }}>
            {order.status}
          </span>
        </p>

        {/* Envío */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--color-primary-text)" }}>
            Datos de envío
          </h4>
          <div className="text-sm leading-6" style={{ color: "var(--color-secondary-text)" }}>
            <p>{order.shipping.firstName} {order.shipping.lastName}</p>
            <p>
              {order.shipping.address}, {order.shipping.city}, {order.shipping.province},
              {" "}CP {order.shipping.postalCode}
            </p>
            <p>Tel: {order.shipping.phone}</p>
          </div>
        </div>

        {/* Método de pago */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--color-primary-text)" }}>
            Método de pago
          </h4>
          <p className="text-sm" style={{ color: "var(--color-secondary-text)"}}>
            {paymentLabels[order.paymentMethod]}
          </p>
        </div>

        {/* Productos */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--color-primary-text)"}}>
            Productos
          </h4>

          <ul
            className="space-y-3 border rounded-lg p-4"
            // Lista sobre superficie tenue + borde NEUTRO (no el acento)
            style={{
              background: "var(--surface-muted, #f3f4f6)",         // ≈ bg-gray-100/50
              borderColor: "var(--border, #d1d5db)",               // ≈ gray-300
            }}
          >
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between text-sm"
                style={{ color: "var(--text-primary, #111827)" }}
              >
                <span>
                  {item.title}{" "}
                  <span style={{ color: "var(--color-secondary-text)" }}>
                    x{item.quantity}
                  </span>
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div
            className="flex justify-between mt-4 font-bold text-base border-t pt-4"
            // Borde inferior NEUTRO
            style={{
              color: "var(--color-primary-text)",
              borderColor: "var(--border, #d1d5db)",
            }}
          >
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
