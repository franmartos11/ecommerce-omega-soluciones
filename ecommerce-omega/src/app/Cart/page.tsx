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

  // Carga inicial del carrito
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  // Eliminar un item del carrito
  const handleRemove = (id: string) => {
    removeFromCart(id);
    setCartItems(getCart());
  };

  // Actualizar cantidad de un item
  const handleQtyChange = (id: string, qty: number) => {
    updateCartQty(id, qty);
    setCartItems(getCart());
  };

  // Vaciar todo el carrito
  const handleClear = () => {
    clearCart();
    setCartItems([]);
  };

  // Abrir modal de checkout si hay items
  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setIsModalOpen(true);
    }
  };

  // Cerrar modal de checkout
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Calcular total del carrito
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-geist-sans relative">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Tu Carrito</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Tu carrito está vacío</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Lista de productos */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white rounded-lg p-4 shadow hover:shadow-md transition"
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
                      <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-sm text-gray-500">Cantidad:</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => handleQtyChange(item.id, Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="w-16 border text-black border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-bg1"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Subtotal: <span className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="cursor-pointer text-red-500 hover:text-red-600 text-sm font-medium"
                  >Eliminar</button>
                </div>
              ))}
              <button
                onClick={handleClear}
                className="cursor-pointer text-red-600 hover:text-red-700 underline text-sm"
              >Vaciar carrito</button>
            </div>

            {/* Resumen y botón de checkout */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Resumen</h2>

              <ul className="space-y-3 max-h-64 overflow-auto">
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center text-gray-700">
                    <span className="font-medium truncate">{item.title}</span>
                    <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
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
                className={`cursor-pointer w-full py-3 rounded-lg font-medium transition ${
                  cartItems.length === 0 ? 'bg-green-300 cursor-not-allowed' : 'bg-bg1 hover:bg-bg2 text-white'
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

      {/* Modal de checkout integrado */}
      <CheckoutModal open={isModalOpen} onClose={handleCloseModal} />

      <Footer />
    </div>
  );
}
