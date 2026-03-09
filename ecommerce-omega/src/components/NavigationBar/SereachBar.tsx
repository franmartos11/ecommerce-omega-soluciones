"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";

interface SearchProduct {
  id: string;
  title: string;
  imageUrl: string;
  currentPrice: number;
  category?: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<SearchProduct> | null>(null);

  // Fetch products once for search index
  useEffect(() => {
    let mounted = true;
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchProduct[]) => {
        if (mounted && Array.isArray(data)) {
          setProducts(data);
          fuseRef.current = new Fuse(data, {
            keys: ["title", "category"],
            threshold: 0.35,
            includeScore: true,
          });
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setHighlightIdx(-1);
    if (value.trim().length < 2 || !fuseRef.current) {
      setResults([]);
      setOpen(false);
      return;
    }
    const fuseResults = fuseRef.current.search(value).slice(0, 6);
    setResults(fuseResults.map((r) => r.item));
    setOpen(fuseResults.length > 0);
  }, []);

  const goToShop = (searchQuery: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/?busqueda=${encodeURIComponent(searchQuery)}`);
  };

  const goToProduct = (id: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/ProductoDetailPage/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIdx >= 0 && results[highlightIdx]) {
        goToProduct(results[highlightIdx].id);
      } else if (query.trim()) {
        goToShop(query);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  // suppress unused var warnings
  void products;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden shadow-md focus-within:ring-2 transition w-full"
        style={{ "--tw-ring-color": "var(--color-primary-bg)" } as React.CSSProperties}>
        <div className="relative flex items-center flex-1">
          <Search className="absolute left-3 w-4 h-4 pointer-events-none" style={{ color: "var(--color-secondary-text)" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setOpen(true)}
            className="w-full pl-9 pr-8 py-2 text-sm outline-none"
            style={{ color: "var(--color-primary-text)", background: "transparent" }}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
              className="absolute right-2 cursor-pointer"
            >
              <X className="w-4 h-4" style={{ color: "var(--color-secondary-text)" }} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => query.trim() && goToShop(query)}
          className="cursor-pointer px-3 py-2 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-110 active:scale-95"
          style={{ background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)" }}
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] overflow-hidden"
          >
            {results.map((product, i) => (
              <button
                key={product.id}
                onClick={() => goToProduct(product.id)}
                onMouseEnter={() => setHighlightIdx(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                  i === highlightIdx ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <img
                  src={product.imageUrl || "/placeholder.png"}
                  alt={product.title}
                  className="w-10 h-10 object-contain rounded-lg bg-gray-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-primary-text)" }}>
                    {product.title}
                  </p>
                  {product.category && (
                    <p className="text-xs" style={{ color: "var(--color-secondary-text)" }}>
                      {product.category}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: "var(--color-primary-bg)" }}>
                  ${product.currentPrice?.toFixed(2)}
                </span>
              </button>
            ))}

            <button
              onClick={() => goToShop(query)}
              className="w-full px-4 py-3 text-sm font-medium text-center border-t border-gray-100 transition-colors cursor-pointer hover:bg-gray-50"
              style={{ color: "var(--color-primary-bg)" }}
            >
              Ver todos los resultados para &quot;{query}&quot;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
