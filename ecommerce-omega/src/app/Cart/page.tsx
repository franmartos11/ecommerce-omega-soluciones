'use client';

import {useEffect, useState } from 'react';
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
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Tu Carrito</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Tu carrito está vacío</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Lista de productos */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => (
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
                          onChange={(e) =>
                            handleQtyChange(
                              item.id,
                              Math.max(1, parseInt(e.target.value, 10) || 1)
                            )
                          }
                          className="w-16 border text-gray-700 border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
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
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <button
                onClick={handleClear}
                className="cursor-pointer text-red-600 hover:text-red-700 underline text-sm"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Resumen */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Resumen</h2>

              {/* Desglose de productos */}
              <ul className="space-y-3 max-h-64 overflow-auto">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center text-gray-700"
                  >
                    <span className="font-medium truncate">{item.title}</span>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className=" cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition">
                Finalizar Compra
              </button>

              <Link
                href="/"
                className="block text-center text-green-600 hover:underline text-sm"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

