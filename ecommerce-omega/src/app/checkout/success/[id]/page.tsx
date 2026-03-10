"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Clock, ArrowLeft, Download, RefreshCcw, Landmark } from "lucide-react";
import Image from "next/image";

// Típico formato de orden recibida por nuestra API
type OrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type OrderData = {
  id: string;
  items: OrderItem[];
  shipping: {
    fullName: string;
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
  reference?: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function OrderSuccessPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Orden no encontrada");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <RefreshCcw className="w-8 h-8 animate-spin text-gray-400 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Generando su comprobante...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Comprobante no encontrado</h2>
          <p className="text-gray-500 mb-6 text-sm">
            No pudimos ubicar la orden solicitada. Es posible que el enlace sea incorrecto.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="w-full text-white font-medium py-3 rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary-bg)" }}
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4 sm:px-6 print:bg-white print:pt-0 print:pb-0 font-sans">
      
      {/* Botones Flotantes (Solo Web, se ocultan al imprimir) */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-8 print:hidden">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm font-semibold transition hover:opacity-75"
          style={{ color: "var(--color-primary-bg)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </button>
        
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-white shadow hover:opacity-90 transition"
          style={{ backgroundColor: "var(--color-primary-bg)" }}
        >
          <Download className="w-4 h-4" />
          Descargar PDF / Imprimir
        </button>
      </div>

      {/* Tarjeta del Comprobante (Diseño para Web y PDF) */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden print:shadow-none print:border-none print:m-0 print:w-full print:max-w-full print:rounded-none">
        
        {/* Header Ribbon */}
        <div style={{ backgroundColor: "var(--color-primary-bg)" }} className="h-4 w-full print:h-2"></div>
        
        <div className="p-8 sm:p-12">
          
          {/* Header: Success / Pending transfer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 border-b border-gray-100 pb-8">
            <div>
              {order.paymentMethod === "transfer" ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-8 h-8 text-amber-500" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      ¡Pedido recibido!
                    </h1>
                  </div>
                  <p className="text-gray-500 text-sm">Tu pedido fue registrado y está pendiente de verificación.</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500 print:text-gray-800" />
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      ¡Gracias por tu compra!
                    </h1>
                  </div>
                  <p className="text-gray-500 text-sm">Tu pedido ha sido procesado exitosamente.</p>
                </>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-left sm:text-right border border-gray-100 print:bg-white print:border-none min-w-[200px]">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Comprobante Nº</p>
              <p className="font-mono text-sm text-gray-900 font-medium truncate max-w-[200px]" title={order.id}>
                {order.id.split('-')[0].toUpperCase()} - REF
              </p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-3 mb-1">Fecha</p>
              <p className="text-sm text-gray-900 font-medium">
                {new Date(order.createdAt).toLocaleDateString("es-AR", { 
                  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" 
                })}
              </p>
            </div>
          </div>

          {/* Transfer pending notice */}
          {order.paymentMethod === "transfer" && (
            <div className="mb-8 p-4 rounded-xl border flex gap-3 items-start" style={{ backgroundColor: "#fefce8", borderColor: "#fde68a" }}>
              <Landmark className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#d97706" }} />
              <div>
                <p className="font-semibold text-sm" style={{ color: "#92400e" }}>Pendiente de verificación de transferencia</p>
                <p className="text-xs mt-1" style={{ color: "#78350f" }}>
                  Revisaremos tu comprobante de transferencia a la brevedad y actualizaremos el estado de tu pedido. 
                  Te contactaremos por WhatsApp o email para confirmar.
                </p>
                {order.reference && (
                  <p className="text-xs mt-2 font-mono bg-amber-100 px-2 py-1 rounded" style={{ color: "#92400e" }}>
                    Referencia ingresada: <strong>{order.reference}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Grilla principal de info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            {/* Detalles de Envío */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2" style={{ color: "var(--color-primary-bg)"}}>
                Datos de Envío
              </h3>
              <div className="text-gray-600 text-sm space-y-1.5 leading-relaxed">
                <p className="font-semibold text-gray-900 text-base mb-2">{order.shipping.fullName}</p>
                <p>{order.shipping.street} {order.shipping.number}</p>
                <p>{order.shipping.city}, {order.shipping.state}</p>
                <p>CP: {order.shipping.zip}</p>
              </div>
            </div>

            {/* Detalles de Pago */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2" style={{ color: "var(--color-primary-bg)"}}>
                Información de Pago
              </h3>
              <div className="text-gray-600 text-sm space-y-1.5 leading-relaxed">
                <p className="flex justify-between">
                  <span>Método:</span>
                  <span className="font-medium text-gray-900 inline-block px-2 py-0.5 bg-gray-100 rounded text-xs uppercase">
                    {order.paymentMethod === "mercadopago" ? "Mercado Pago" : 
                     order.paymentMethod === "transfer" ? "Transferencia Bancaria" : 
                     "Pago en Local"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Estado Inicial:</span>
                  <span className="font-medium text-amber-600">{order.status.toUpperCase()}</span>
                </p>
                {order.reference && (
                  <p className="flex justify-between mt-2 pt-2 border-t border-gray-50">
                    <span>Referencia:</span>
                    <span className="font-medium text-gray-900">{order.reference}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2" style={{ color: "var(--color-primary-bg)"}}>
              Resumen del Pedido
            </h3>
            
            <div className="mt-4">
              {/* Encabezado Tabla */}
              <div className="hidden sm:grid grid-cols-12 gap-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <div className="col-span-6">Producto</div>
                <div className="col-span-2 text-center">Cant</div>
                <div className="col-span-2 text-right">Precio</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {order.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 items-center">
                    <div className="col-span-12 sm:col-span-6 flex items-center gap-3">
                      {item.imageUrl ? (
                        <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative">
                          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs text-center leading-none p-1">Sin Foto</span>
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-900 leading-tight">{item.title}</p>
                    </div>
                    
                    <div className="col-span-6 sm:col-span-2 text-left sm:text-center text-sm text-gray-600 before:content-['Cant:_'] sm:before:content-none inline-flex sm:block">
                      {item.quantity}
                    </div>
                    
                    <div className="col-span-6 sm:col-span-2 text-right text-sm text-gray-500">
                      {formatMoney(item.price)}
                    </div>
                    
                    <div className="col-span-12 sm:col-span-2 text-right text-sm font-semibold text-gray-900 mt-2 sm:mt-0">
                      {formatMoney(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Footer */}
            <div className="mt-8 pt-6 border-t font-sans">
              <div className="flex flex-col items-end gap-2">
                <div className="flex justify-between w-full sm:w-64 text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatMoney(order.total)}</span>
                </div>
                <div className="flex justify-between w-full sm:w-64 text-sm text-gray-500">
                  <span>Costo de envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="w-full sm:w-64 border-b border-gray-100 my-1"></div>
                <div className="flex justify-between w-full sm:w-64 text-xl font-bold text-gray-900 mt-1">
                  <span>Total</span>
                  <span style={{ color: "var(--color-primary-bg)" }}>{formatMoney(order.total)}</span>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
        
        {/* Footer Ribbon */}
        <div className="bg-gray-50 p-6 text-center text-xs text-gray-400 border-t border-gray-100">
          <p>Este comprobante tiene validez digital. Si tienes alguna duda, contáctate con nuestro soporte mostrando la Referencia de Comprobante.</p>
        </div>
      </div>

    </div>
  );
}
