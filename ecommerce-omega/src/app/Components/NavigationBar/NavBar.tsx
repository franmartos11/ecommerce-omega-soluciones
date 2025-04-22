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
    { label: 'Contáctanos', href: 'Contacto' },
  ];

  return (
    <header className="w-full bg-white">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-[0.5rem] md:px-6 py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>

        {/* Logo + Search */}
        <div className="flex-1 flex items-center gap-6">
          <div className="text-2xl font-bold text-gray-800">Logo</div>
          <div className="hidden md:flex flex-1">
            <SearchBar />
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4 text-gray-700 text-sm">
          <div className="relative flex items-center gap-1">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">Carro</span>
            <span className="absolute -top-2 -right-3 bg-green-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <User className="w-5 h-5" />
            <a href='/LogIn'>
            <span>Cuenta</span>
            </a>
          </div>
        </div>
      </div>

      {/* Menu Desktop */}
      <div className="hidden md:block border-t border-b border-gray-200 w-full mb-[2rem] bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
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

          <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
            <Headphones className="w-5 h-5 text-gray-800" />
            <span className="text-base">1900 - 888</span>
            <span className="text-xs text-gray-500 font-normal">24/7 Soporte</span>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t">
          <SearchBar />

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

