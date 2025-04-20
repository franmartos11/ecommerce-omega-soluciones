'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Headphones,
} from 'lucide-react';
import SearchBar from './SereachBar';


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', href: '/', highlight: true },
    { label: 'Tienda', href: '#' },
    { label: 'Nosotros', href: '#' },
    { label: 'Unidades de negocio', href: '#' },
    { label: 'Marcas', href: '#' },
    { label: 'Contáctanos', href: '#' },
  ];

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>

        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800 mx-auto md:mx-0">Logo</div>

        {/* Right icons */}
        <div className="flex items-center gap-4 text-gray-700 text-sm">
            
          {/* Carrito */}
          <div className="relative flex items-center gap-1">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">Cart</span>
            <span className="absolute -top-2 -right-3 bg-green-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          {/* Cuenta */}
          <div className="hidden md:flex items-center gap-1">
            <User className="w-5 h-5" />
            <span>Account</span>
          </div>
        </div>
      </div>

      {/* SearchBar Desktop */}
      <div className="hidden md:block px-6 pb-2 max-w-7xl mx-auto">
        <SearchBar />
      </div>

      {/* Menu Desktop */}
      <div className="hidden md:block border-t bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Menu Items */}
          <nav className="flex gap-6 text-sm font-medium text-gray-800">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={item.highlight ? 'text-green-500' : 'hover:text-green-500'}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Support Info */}
          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
            <Headphones className="w-5 h-5 text-gray-800" />
            <span className="text-base">1900 - 888</span>
            <span className="text-xs text-gray-500 font-normal">24/7 Support Center</span>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t">
          {/* Search */}
          <SearchBar />

          {/* Links */}
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block text-sm font-medium text-gray-800 hover:text-green-600"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Account + Soporte */}
          <div className="pt-4 text-sm font-medium text-green-600 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-gray-800" />
            <span>1900 - 888</span>
            <span className="text-xs text-gray-500">24/7 Soporte</span>
          </div>
        </div>
      )}
    </header>
  );
}
