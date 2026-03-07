import React from "react";
import { Package, Truck, CreditCard, X, Receipt } from "lucide-react";

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
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          background: "var(--surface, #ffffff)",
          color: "var(--color-primary-text)",
          borderColor: "var(--border, #e5e7eb)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fijo */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--border, #e5e7eb)" }}>
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="w-6 h-6" style={{ color: "var(--color-primary-bg)" }} />
              Orden #{order.id.slice(0, 8).toUpperCase()}
            </h3>
            <p className="text-sm mt-1 flex items-center gap-2" style={{ color: "var(--color-secondary-text)" }}>
              {new Date(order.date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mx-1"></span>
              <span className="capitalize font-semibold px-2.5 py-0.5 rounded-full text-xs"
                    style={{ background: "var(--surface-muted, #f3f4f6)", color: "var(--color-primary-text)" }}>
                {order.status}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: "var(--color-secondary-text)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Envío */}
            <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border, #e5e7eb)", background: "var(--surface-muted, #fafafa)" }}>
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide mb-3" style={{ color: "var(--color-secondary-text)" }}>
                <Truck className="w-4 h-4" /> Datos de envío
              </h4>
              <div className="text-sm space-y-1" style={{ color: "var(--color-primary-text)" }}>
                <p className="font-semibold">{order.shipping.firstName} {order.shipping.lastName}</p>
                <p>{order.shipping.address}</p>
                <p>{order.shipping.city}, {order.shipping.province} (CP {order.shipping.postalCode})</p>
                <p className="pt-2 text-xs" style={{ color: "var(--color-secondary-text)" }}>Tel: {order.shipping.phone}</p>
              </div>
            </div>

            {/* Método de pago */}
            <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border, #e5e7eb)", background: "var(--surface-muted, #fafafa)" }}>
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide mb-3" style={{ color: "var(--color-secondary-text)" }}>
                <CreditCard className="w-4 h-4" /> Método de pago
              </h4>
              <p className="text-sm font-medium" style={{ color: "var(--color-primary-text)"}}>
                {paymentLabels[order.paymentMethod]}
              </p>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "var(--color-secondary-text)"}}>
              <Package className="w-4 h-4" /> Resumen de Productos
            </h4>

            <div className="border rounded-xl overflow-hidden" style={{ borderColor: "var(--border, #e5e7eb)" }}>
              <ul className="divide-y" style={{ borderColor: "var(--border, #e5e7eb)" }}>
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center p-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "var(--color-primary-text)" }}>{item.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-secondary-text)" }}>Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-right" style={{ color: "var(--color-primary-text)" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="p-4 border-t" style={{ borderColor: "var(--border, #e5e7eb)", background: "var(--surface-muted, #fafafa)" }}>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold" style={{ color: "var(--color-primary-text)" }}>Total pagado</span>
                  <span className="font-bold whitespace-nowrap" style={{ color: "var(--color-primary-bg)" }}>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
