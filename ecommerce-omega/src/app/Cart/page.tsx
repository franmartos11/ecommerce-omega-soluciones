'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getCart,
  removeFromCart,
  updateCartQty,
  clearCart,
} from '@/utils/CartUtils';
import Navbar from '../Components/NavigationBar/NavBar';
import Footer from '../Components/Footer/Footer';
import CheckoutModal from '../Components/CheckoutComponents/CheckoutModal';

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

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white min-h-screen font-geist-sans relative">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Tu Carrito</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Tu carrito está vacío</p>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Lista de productos */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-sm text-gray-500">Cantidad:</label>
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
                          className="w-20 border text-black border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-bg1"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Subtotal:{' '}
                        <span className="font-medium text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="mt-4 sm:mt-0 text-red-500 hover:text-red-600 text-sm font-medium self-start sm:self-auto"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                onClick={handleClear}
                className="text-red-600 hover:text-red-700 underline text-sm"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Resumen abajo */}
            <div className="w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Resumen</h2>

              <ul className="space-y-3 max-h-64 overflow-auto">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center text-gray-700 text-sm"
                  >
                    <span className="font-medium truncate">{item.title}</span>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  cartItems.length === 0
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-bg1 hover:bg-bg2 text-white'
                }`}
              >
                Finalizar Compra
              </button>

              <Link
                href="/"
                className="block text-center text-bg1 hover:underline text-sm"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        )}
      </section>

      <CheckoutModal open={isModalOpen} onClose={handleCloseModal} />

      <Footer />
    </div>
  );
}
