"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";

export default function WhatsAppFloat() {
  return (
    <Link
      href="https://wa.me/5493876195572?text=Hola%2C%20necesito%20ayuda%20con%20mi%20compra"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-6 z-50"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
      >
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-white rounded-lg shadow-lg text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¿Necesitás ayuda?
          <div className="absolute top-full right-4 w-2 h-2 bg-white rotate-45 -mt-1" />
        </div>

        {/* Button */}
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          style={{ background: "#25D366" }}>
          <SiWhatsapp className="w-7 h-7 text-white" />
        </div>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "#25D366" }}
          animate={{ scale: [1, 1.4, 1.4], opacity: [0.4, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>
    </Link>
  );
}
