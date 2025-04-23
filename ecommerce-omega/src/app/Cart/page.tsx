'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

    useEffect(() => {
        //  cargar desde context o localStorage
        const mockCart: CartItem[] = [
            {
                id: '1',
                title: 'Blue Diamond Almonds Lightly',
                imageUrl: '/products/sample.jpg',
                price: 23.85,
                quantity: 2,
            },
            {
                id: '2',
                title: 'Wireless Headphones',
                imageUrl: '/products/headphones.jpg',
                price: 99.9,
                quantity: 1,
            },
        ];
        setCartItems(mockCart);
    }, []);

    const removeItem = (id: string) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className='bg-white'>
            <Suspense fallback={<p>Cargando...</p>}>
                <Navbar></Navbar>
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
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                width={80}
                                                height={80}
                                                className="rounded object-cover"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                                                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                                <p className="text-sm text-gray-500">
                                                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:underline text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Resumen */}
                            <div className="border rounded-lg p-6 shadow space-y-4">
                                <h2 className="text-xl font-bold text-gray-800">Resumen</h2>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Total:</span>
                                    <span className="text-green-600 font-semibold">${total.toFixed(2)}</span>
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
                <Footer></Footer>
            </Suspense>
        </div>
    );
}