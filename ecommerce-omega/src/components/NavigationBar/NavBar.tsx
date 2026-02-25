"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import siteConfig from "@/ConfigJson/config.json";
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
    const storedUser = localStorage.getItem("userLoggedIn");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
    refreshCartCount();

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
    <header className="w-full z-50 relative" style={{ background: "var(--bgweb)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        {/* botón menú mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? (
            <X className="w-6 h-6" style={{ color: "var(--color-secondary-text)" }} />
          ) : (
            <Menu className="w-6 h-6" style={{ color: "var(--color-secondary-text)" }} />
          )}
        </button>

        {/* Logo + SearchBar separadas (NO dentro del Link) */}
        <div className="flex-1 flex items-center gap-6">
          <Link href="/" className="flex items-center" aria-label="Ir al inicio">
            {siteConfig?.Logo?.src ? (
              <Image
                src={siteConfig.Logo.src}
                alt={siteConfig.Logo.alt ?? siteConfig?.sitio?.nombre ?? "Logo"}
                width={140}
                height={36}
                priority
                sizes="(max-width: 768px) 120px, 140px"
                style={{ height: "auto", width: "auto", maxHeight: 36 }}
              />
            ) : (
              <span className="text-2xl font-bold" style={{ color: "var(--color-primary-text)" }}>
                {siteConfig?.sitio?.nombre ?? "Logo"}
              </span>
            )}
          </Link>

          <div className="hidden md:flex flex-1">
            <SearchBar />
          </div>
        </div>

        {/* acciones derecha */}
        <div className="flex items-center gap-4 text-sm relative" style={{ color: "var(--color-secondary-text)" }}>
          <Link href="/Cart" aria-label="Ir al carrito">
            <div className="relative flex items-center gap-1">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Carro</span>
              <span
                className="absolute -top-2 -right-3 text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)" }}
              >
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
                    className="absolute top-full right-0 mt-2 border rounded shadow-md z-[9999] w-44 py-2"
                    style={{ background: "var(--bgweb)" }}
                  >
                    <Link
                      href="/OrdersPanel"
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      style={{ color: "var(--color-primary-text)" }}
                    >
                      Mis Compras
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      style={{ color: "var(--color-danger, #dc2626)" }}
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
            <Link href="/LogIn" className="hidden md:flex items-center gap-1">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Iniciar sesión</span>
            </Link>
          )}
        </div>
      </div>

      {/* barra inferior (desktop) */}
      <div className="hidden md:block border-t border-b border-gray-200 w-full mb-[2rem]" style={{ background: "var(--bgweb)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <nav className="flex gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={pathname === item.href ? "border-b-2" : ""}
                style={
                  pathname === item.href
                    ? { color: "var(--color-primary-bg)", borderColor: "var(--color-primary-bg)" }
                    : { color: "var(--color-secondary-text)" }
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: "var(--color-primary-bg)" }}>
            <Headphones className="w-5 h-5" />
            <span className="text-base">1900 - 888</span>
            <span className="text-xs" style={{ color: "var(--color-secondary-text)" }}>
              24/7 Soporte
            </span>
          </div>
        </div>
      </div>

      {/* menú mobile */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 border-t relative z-50" style={{ background: "var(--bgweb)" }}>
          {/* buscador */}
          <SearchBar />

          {/* navegación */}
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm font-medium"
                style={pathname === item.href ? { color: "var(--color-primary-text)" } : { color: "var(--color-secondary-text)" }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* carrito (visible ya en header, pero lo dejamos también aquí si querés acceso dentro del panel) */}
          <Link
            href="/Cart"
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--color-primary-text)" }}
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Carro</span>
            <span
              className="ml-auto text-[10px] w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)" }}
            >
              {cartCount}
            </span>
          </Link>

          {/* sección CUENTA */}
          <div className="pt-3 border-t" style={{ borderColor: "var(--border, #374151)" }}>
            <h4 className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--color-secondary-text)" }}>
              Cuenta
            </h4>

            {!user ? (
              <Link
                href="/LogIn"
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--color-primary-text)" }}
                onClick={() => setMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Iniciar sesión</span>
              </Link>
            ) : (
              <div className="grid gap-2">
                <Link
                  href="/OrdersPanel"
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: "var(--color-primary-text)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Mis Compras</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                  style={{ color: "var(--color-danger, #ef4444)" }}
                  disabled={loading}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>

          {/* soporte */}
          <div className="pt-2 text-sm font-medium flex items-center gap-2">
            <Headphones className="w-5 h-5" style={{ color: "var(--color-primary-text)" }} />
            <span style={{ color: "var(--color-primary-bg)" }}>1900 - 888</span>
            <span className="text-xs" style={{ color: "var(--color-secondary-text)" }}>
              24/7 Soporte
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
