'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Headphones } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const menuItems = [
    { label: 'Inicio', href: '/', highlight: true },
    { label: 'Tienda', href: '#' },
    { label: 'Nosotros', href: '#' },
    { label: 'Unidades de negocio', href: '#' },
    { label: 'Marcas', href: '#' },
    { label: 'Contáctanos', href: '#' },
  ];

  return (
    <header className="w-full bg-white shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-green-500 font-semibold text-lg">
          <span className="text-2xl">🔥</span>
          <span>Deals</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-800">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={item.highlight ? 'text-green-500' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Contact Info */}
        <div className="hidden md:flex items-center gap-2 text-green-600 font-semibold text-lg">
          <Headphones className="w-6 h-6 text-gray-800" />
          <span>1900 - 888</span>
          <span className="text-xs text-gray-500 font-normal">24/7 Support Center</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md text-gray-700 focus:outline-none"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-2 space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block px-4 py-2 rounded-md text-sm font-medium ${
                item.highlight ? 'text-green-500' : 'text-gray-800'
              } hover:bg-gray-100`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="flex items-center gap-2 px-4 pt-2 text-green-600 font-semibold text-lg">
            <Headphones className="w-5 h-5 text-gray-800" />
            <span>1900 - 888</span>
          </div>
          <p className="text-xs text-gray-500 px-4">24/7 Support Center</p>
        </div>
      )}
    </header>
  );
}

