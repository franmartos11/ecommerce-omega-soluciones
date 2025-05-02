// src/app/Cart/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getCart,
  removeFromCart,
  updateCartQty,
  clearCart,
} from '@/utils/CartUtils';
import Navbar from '../Components/NavigationBar/NavBar';
import Footer from '../Components/Footer/Footer';



interface CartItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Carga inicial
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setCartItems(getCart());
  };

  const handleQtyChange = (id: string, qty: number) => {
    updateCartQty(id, qty);
    setCartItems(getCart());
  };

  const handleClear = () => {
    clearCart();
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando carrito…</div>}>
      <Navbar />

      <div className="bg-white p-8 min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Tu Carrito</h1>

          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-center">Tu carrito está vacío</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Lista de productos */}
              <div className="md:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="rounded object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <label className="text-sm text-gray-500">
                            Cantidad:
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQtyChange(
                                item.id,
                                Math.max(1, parseInt(e.target.value, 10) || 1)
                              )
                            }
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleClear}
                  className="text-sm text-red-600 hover:underline"
                >
                  Vaciar carrito
                </button>
              </div>

              {/* Resumen */}
              <div className="border rounded-lg p-6 shadow space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Resumen</h2>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total:</span>
                  <span className="text-green-600 font-semibold">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm">
                  Finalizar Compra
                </button>
                <Link
                  href="/"
                  className="block text-center text-sm text-green-600 hover:underline"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </Suspense>
  );
}
