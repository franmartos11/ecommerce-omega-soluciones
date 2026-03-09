"use client";

import React from "react";
import { motion } from "framer-motion";
import { SiFacebook, SiX, SiWhatsapp } from "react-icons/si";
import { Link2 } from "lucide-react";
import toast from "react-hot-toast";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <SiWhatsapp className="w-4 h-4" />,
      bg: "#25D366",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <SiFacebook className="w-4 h-4" />,
      bg: "#1877F2",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <SiX className="w-4 h-4" />,
      bg: "#000000",
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado", {
      style: { borderRadius: "12px", background: "#333", color: "#fff", fontSize: "14px" },
      duration: 1500,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium mr-1" style={{ color: "var(--color-secondary-text)" }}>
        Compartir:
      </span>
      {shareLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-shadow hover:shadow-md"
          style={{ background: link.bg }}
          title={`Compartir en ${link.name}`}
        >
          {link.icon}
        </motion.a>
      ))}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={copyLink}
        className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 transition-shadow hover:shadow-md cursor-pointer"
        style={{ color: "var(--color-secondary-text)" }}
        title="Copiar link"
      >
        <Link2 className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
