"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm py-3 flex-wrap">
      <Link
        href="/"
        className="flex items-center gap-1 hover:underline transition-colors"
        style={{ color: "var(--color-secondary-text)" }}
      >
        <Home className="w-3.5 h-3.5" />
        <span>Inicio</span>
      </Link>

      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--color-secondary-text)" }} />
            {isLast || !item.href ? (
              <span className="font-medium truncate max-w-[200px]" style={{ color: "var(--color-primary-text)" }}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:underline transition-colors truncate max-w-[200px]"
                style={{ color: "var(--color-secondary-text)" }}
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
