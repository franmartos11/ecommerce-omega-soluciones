import React from "react";

type Props = {
  order: {
    id: string;
    date: string;
    total: number;
    status: string;
    items: {
      id: string;
      title: string;
      price: number;
      quantity: number;
    }[];
    shipping: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      province: string;
      postalCode: string;
      phone: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto animate-fade-in">
        <button
          onClick={onClose}
          className=" cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <h3 className="text-2xl font-bold mb-2 text-gray-800">
          Orden #{order.id.slice(0, 6)}...
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {new Date(order.date).toLocaleString()} —{" "}
          <span className="capitalize font-semibold text-blue-600">
            {order.status}
          </span>
        </p>
        {/* Envío */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Datos de envío
          </h4>
          <div className="text-sm text-gray-600 leading-6">
            <p>
              {order.shipping.firstName} {order.shipping.lastName}
            </p>
            <p>
              {order.shipping.address}, {order.shipping.city},{" "}
              {order.shipping.province}, CP {order.shipping.postalCode}
            </p>
            <p>Tel: {order.shipping.phone}</p>
          </div>
        </div>

        {/* Método de pago */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Método de pago
          </h4>
          <p className="text-sm text-gray-600">
            {paymentLabels[order.paymentMethod]}
          </p>
        </div>

        {/* Productos */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Productos
          </h4>
          <ul className="space-y-3 border rounded-lg p-4 bg-gray-50">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>
                  {item.title}{" "}
                  <span className="text-gray-400">x{item.quantity}</span>
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 font-bold text-gray-900 text-base border-t pt-4">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
