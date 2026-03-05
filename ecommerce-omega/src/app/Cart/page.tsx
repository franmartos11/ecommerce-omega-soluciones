"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCart,
  removeFromCart,
  updateCartQty,
  clearCart,
} from "@/utils/CartUtils";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import CheckoutModal from "@/components/CheckoutComponents/CheckoutModal";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ShieldCheck } from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCartItems(getCart());
  }, []);

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setCartItems(getCart());
  };

  const handleQtyChange = (id: string, qty: number) => {
    if (qty < 1) return;
    updateCartQty(id, qty);
    setCartItems(getCart());
  };

  const handleClear = () => {
    clearCart();
    setCartItems([]);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div
      className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]"
      style={{ background: "var(--bgweb)" }}
    >
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8" style={{ color: "var(--color-primary-text)" }} />
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--color-primary-text)" }}
          >
            Tu Carrito
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border-2 border-dashed border-gray-200" style={{ background: "var(--bgweb)" }}>
            <div className="w-24 h-24 mb-6 rounded-full flex items-center justify-center bg-gray-50">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-primary-text)" }}>
              Tu carrito está vacío
            </h2>
            <p className="mb-8 max-w-md" style={{ color: "var(--color-secondary-text)" }}>
              ¿Aún no te has decidido? Tenemos miles de productos esperando por ti. Explora nuestra tienda y encuentra lo que buscas.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: "var(--color-primary-bg)", color: "#fff" }}
            >
              Volver a la tienda
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="lg:flex lg:gap-10 items-start">
            {/* Left Column: Cart Items */}
            <div className="lg:w-2/3 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ background: "var(--bgweb)", borderColor: "var(--color-border, #e5e7eb)" }}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold" style={{ color: "var(--color-primary-text)" }}>
                      Productos ({totalItems})
                    </h2>
                    <button
                      onClick={handleClear}
                      className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 group"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Vaciar carrito
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0"
                      >
                        {/* Image */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-grow flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3
                                className="font-semibold text-lg line-clamp-2"
                                style={{ color: "var(--color-primary-text)" }}
                              >
                                {item.title}
                              </h3>
                              <p className="mt-1 font-medium text-lg" style={{ color: "var(--color-primary-text)" }}>
                                ${(item.price).toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Controls & Subtotal */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium" style={{ color: "var(--color-secondary-text)" }}>
                                Cantidad:
                              </span>
                              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/50">
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-semibold text-sm select-none" style={{ color: "var(--color-primary-text)" }}>
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-r-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-xs uppercase font-bold tracking-wider mb-1 block" style={{ color: "var(--color-secondary-text)" }}>Subtotal</span>
                              <span
                                className="font-bold text-lg"
                                style={{ color: "var(--color-primary-text)" }}
                              >
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="lg:w-1/3 mt-8 lg:mt-0 sticky top-24">
              <div
                className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                style={{ background: "var(--bgweb)", borderColor: "var(--color-border, #e5e7eb)" }}
              >
                <div className="p-6 sm:p-8">
                  <h2
                    className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100"
                    style={{ color: "var(--color-primary-text)" }}
                  >
                    Resumen de Compra
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm" style={{ color: "var(--color-secondary-text)" }}>
                      <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                      <span className="font-medium" style={{ color: "var(--color-primary-text)" }}>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm" style={{ color: "var(--color-secondary-text)" }}>
                      <span>Envío</span>
                      <span className="text-green-600 font-medium">Gratis</span>
                    </div>
                  </div>

                  <div
                    className="flex justify-between items-center text-xl font-bold border-t border-gray-100 pt-6 mb-8"
                    style={{ color: "var(--color-primary-text)" }}
                  >
                    <span>Total a pagar</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1 hover:shadow-xl"
                    style={{ backgroundColor: "var(--color-primary-bg)", color: "#fff" }}
                  >
                    Finalizar Compra
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="mt-6 flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Pago 100% seguro y encriptado</span>
                    </div>
                    
                    <Link
                      href="/"
                      className="block text-center text-sm font-medium hover:underline transition-all"
                      style={{ color: "var(--color-secondary-text)" }}
                    >
                      ← Seguir comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <CheckoutModal open={isModalOpen} onClose={handleCloseModal} />

      <Footer />
    </div>
  );
}
