"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Headphones,
  LogOut,
  ChevronDown,
} from "lucide-react";
import SearchBar from "./SereachBar";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getCart } from "@/utils/CartUtils";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Sobre Nosotros", href: "/SobreNosotros" },
    { label: "Contáctanos", href: "/Contacto" },
  ];

  const refreshCartCount = () => {
    const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    // Inicializar user
    const storedUser = localStorage.getItem("userLoggedIn");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Error parsing user from localStorage");
      }
    }
    // Inicializar contador
    refreshCartCount();

    // Escuchar storage y evento custom
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") refreshCartCount();
    };
    const onCartUpdated = () => refreshCartCount();

    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onCartUpdated as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onCartUpdated as EventListener);
    };
  }, []);

  useEffect(() => {
    refreshCartCount();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown)
      document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("userLoggedIn");
      setUser(null);
      setShowDropdown(false);
      setLoading(false);
      toast.success("Sesión cerrada correctamente");
      router.push("/");
    }, 800);
  };

  return (
    <header className="w-full bg-white z-50 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>

        <Link href="/" className="flex-1 flex items-center gap-6">
          <div className="text-2xl font-bold text-gray-800">Logo</div>
          <div className="hidden md:flex flex-1">
            <SearchBar />
          </div>
        </Link>

        <div className="flex items-center gap-4 text-gray-700 text-sm relative">
          <Link href="/Cart">
            <div className="relative flex items-center gap-1">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Carro</span>
              <span className="absolute -top-2 -right-3 bg-bg1 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
          </Link>

          {user ? (
            <div
              className="relative hidden md:flex items-center gap-2 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
              ref={dropdownRef}
            >
              <User className="w-5 h-5" />
              <span>{user.email}</span>
              <ChevronDown className="w-4 h-4" />
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 bg-white border rounded shadow-md z-[9999] w-44 py-2"
                  >
                    <Link
                      href="/OrdersPanel"
                      className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      Mis Compras
                    </Link>
                    <button
                      onClick={handleLogout}
                      className=" cursor-pointer block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      disabled={loading}
                    >
                      <LogOut className="inline w-4 h-4 mr-2" />
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/LogIn">
              <div className="flex items-center gap-1">
                <User className="w-5 h-5" />
                <span className="hidden md:inline">Iniciar sesión</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      <div className="hidden md:block border-t border-b border-gray-200 w-full mb-[2rem] bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <nav className="flex gap-6 text-sm font-medium text-gray-800">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  pathname === item.href
                    ? "text-text2 border-b-2 border-text2"
                    : "hover:text-text2"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-text2 font-semibold text-sm">
            <Headphones className="w-5 h-5 text-gray-800" />
            <span className="text-base text-text2">1900 - 888</span>
            <span className="text-xs text-gray-500 font-normal">
              24/7 Soporte
            </span>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t relative z-50 bg-white">
          <SearchBar />
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block text-sm font-medium ${
                pathname === item.href
                  ? "text-text1"
                  : "text-gray-800 hover:text-text2"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 text-sm font-medium text-text2 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-gray-800" />
            <span className="text-text1">1900 - 888</span>
            <span className="text-xs text-gray-500">24/7 Soporte</span>
          </div>
        </div>
      )}
    </header>
  );
}
