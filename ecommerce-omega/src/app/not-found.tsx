"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bgweb)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Animated 404 */}
        <motion.h1
          className="text-[8rem] md:text-[10rem] font-black leading-none select-none"
          style={{ color: "var(--color-primary-bg)" }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          404
        </motion.h1>

        <h2
          className="text-2xl md:text-3xl font-bold mt-2 mb-3"
          style={{ color: "var(--color-primary-text)" }}
        >
          Página no encontrada
        </h2>

        <p
          className="text-sm md:text-base mb-8 leading-relaxed"
          style={{ color: "var(--color-secondary-text)" }}
        >
          Lo sentimos, la página que buscás no existe o fue movida.
          Pero no te preocupes, ¡tenemos mucho más para ofrecerte!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg transition-shadow hover:shadow-xl"
              style={{
                background: "var(--color-primary-bg)",
                color: "var(--color-tertiary-text)",
              }}
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </motion.button>
          </Link>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-colors"
              style={{
                borderColor: "var(--color-primary-bg)",
                color: "var(--color-primary-bg)",
                background: "transparent",
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              Ir a la tienda
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Decorative floating circles */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-10"
        style={{ background: "var(--color-primary-bg)" }}
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full opacity-10"
        style={{ background: "var(--color-secondary-bg)" }}
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full opacity-5"
        style={{ background: "var(--color-primary-bg)" }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}
