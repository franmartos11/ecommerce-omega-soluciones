"use client";

import Link from "next/link";
import { motion } from "motion/react";
import * as React from "react";

type ButtonProps = {
  label: string;
  href?: string;            
  onClick?: () => void;    
  ariaLabel?: string;
};

type ImageProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  aspect?: string;          
  className?: string;
};

export type HeroDWProps = {
  title: string;            
  subtitle?: string;
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
  image?: ImageProps;
  className?: string;
};

export function HeroDW({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  image,
  className,
}: HeroDWProps) {
  return (
    <div className={`relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center ${className ?? ""}`}>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl">
          {title.split(" ").map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08, ease: "easeInOut" }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600"
          >
            {subtitle}
          </motion.p>
        )}

        {(primaryButton || secondaryButton) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {primaryButton && renderBtn(primaryButton, "primary")}
            {secondaryButton && renderBtn(secondaryButton, "secondary")}
          </motion.div>
        )}

        {image?.src && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md"
          >
            <div className={`w-full overflow-hidden rounded-xl border border-gray-300 ${image.aspect ?? "aspect-[16/9]"}`}>
              <img
                src={image.src}
                alt={image.alt ?? "Preview"}
                className="h-full w-full object-cover"
                height={image.height ?? 1000}
                width={image.width ?? 1000}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function renderBtn(btn: ButtonProps, variant: "primary" | "secondary") {
  const base =
    "w-60 rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800 focus:ring-black"
      : "border border-gray-300 bg-white text-black hover:bg-gray-100 focus:ring-gray-300";

  if (btn.href) {
    return (
      <Link
        href={btn.href}
        aria-label={btn.ariaLabel ?? btn.label}
        className={`${base} ${styles} text-center`}
      >
        {btn.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={btn.onClick}
      aria-label={btn.ariaLabel ?? btn.label}
      className={`${base} ${styles}`}
    >
      {btn.label}
    </button>
  );
}
