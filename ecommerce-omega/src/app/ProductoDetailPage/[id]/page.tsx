"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCardGrid, { Product } from "@/app/Components/ProductCardGrid/ProductCardGrid";
import Navbar from "@/app/Components/NavigationBar/NavBar";
import Footer from "@/app/Components/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/utils/CartUtils";

interface DetailProducts extends Product {
  description: string;
  stock: number;
  tags: string[];
  mfg: string;
  life: string;
}

const mockProducts: DetailProducts[] = [
  {
    id: "1",
    title: "Resma Papel A5 x500 Hoja 80gr",
    imageUrl:
      "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
    currentPrice: 5849,
    oldPrice: 6290,
    rating: 4.5,
    brand: "Ledesma",
    category: "Papelería",
    color: "White",
    condition: "New",
    description:
      "Esta resma de papel A5 de 80 gramos contiene 500 hojas de alta blancura y calidad premium...",
    stock: 8,
    tags: ["Oficina", "Papel", "Impresión"],
    mfg: "2022-06-04",
    life: "70 days",
  },
  {
    id: "2",
    title: "Resma Papel A5 x500 Hoja 80gr",
    imageUrl:
      "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
    currentPrice: 5849,
    oldPrice: 6290,
    rating: 4.5,
    brand: "Ledesma",
    category: "Papelería",
    color: "White",
    condition: "New",
    description:
      "Esta resma de papel A5 de 80 gramos contiene 500 hojas de alta blancura y calidad premium...",
    stock: 8,
    tags: ["Oficina", "Papel", "Impresión"],
    mfg: "2022-06-04",
    life: "70 days",
  },
  {
    id: "3",
    title: "Resma Papel A5 x500 Hoja 80gr",
    imageUrl:
      "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
    currentPrice: 5849,
    oldPrice: 6290,
    rating: 4.5,
    brand: "Ledesma",
    category: "Papelería",
    color: "White",
    condition: "New",
    description:
      "Esta resma de papel A5 de 80 gramos contiene 500 hojas de alta blancura y calidad premium...",
    stock: 8,
    tags: ["Oficina", "Papel", "Impresión"],
    mfg: "2022-06-04",
    life: "70 days",
  },
  {
    id: "4",
    title: "Resma Papel A5 x500 Hoja 80gr",
    imageUrl:
      "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
    currentPrice: 5849,
    oldPrice: 6290,
    rating: 4.5,
    brand: "Ledesma",
    category: "Papelería",
    color: "White",
    condition: "New",
    description:
      "Esta resma de papel A5 de 80 gramos contiene 500 hojas de alta blancura y calidad premium...",
    stock: 8,
    tags: ["Oficina", "Papel", "Impresión"],
    mfg: "2022-06-04",
    life: "70 days",
  },
];

export default function ProductoDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<DetailProducts | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showPopup, setShowPopup] = useState(false);

  const thumbnails = [
    product?.imageUrl || "",
    "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
    "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
  ];

  useEffect(() => {
    const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
    const found = mockProducts.find((p) => p.id === id);
    setProduct(found || null);
    setSelectedImage(found?.imageUrl || null);
  }, [params]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        id: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.currentPrice,
      },
      quantity
    );
    window.dispatchEvent(new Event("cartUpdated"));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  if (!product) return <div className="p-6">Producto no encontrado</div>;

  return (
    <div
      className="min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)] relative"
      style={{ background: "var(--bgweb)", color: "var(--color-primary-text)" }}
    >
      <Navbar />

      <section className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Galería */}
          <div className="flex-1 space-y-4">
            <img
              src={selectedImage ?? product.imageUrl}
              alt={product.title}
              width={400}
              height={500}
              className="rounded-xl"
            />
            <div className="flex gap-2">
              {thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  alt={`thumbnail-${index}`}
                  width={60}
                  height={60}
                  onClick={() => setSelectedImage(thumb)}
                  className="cursor-pointer rounded-lg border-2"
                  style={{
                    borderColor:
                      selectedImage === thumb
                        ? "var(--color-primary-bg)"
                        : "transparent",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <span
              className="text-xs px-2 py-1 rounded-full w-fit"
              style={{
                background: "var(--badge-bg, #fee2e2)",
                color: "var(--badge-text, #ef4444)",
              }}
            >
              Sale Off
            </span>

            <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary-text)" }}>
              {product.title}
            </h1>

            <p className="text-sm" style={{ color: "var(--accent-warning, #eab308)" }}>
              ★ {product.rating} (32 reviews)
            </p>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold" style={{ color: "var(--color-primary-bg)" }}>
                $ {product.currentPrice}
              </span>
              <span className="line-through text-sm" style={{ color: "var(--color-secondary-text)" }}>
                ${product.oldPrice}
              </span>
            </div>

            <p className="text-sm max-w-lg" style={{ color: "var(--color-secondary-text)" }}>
              Papel multifunción de alta calidad, ideal para impresiones claras y profesionales.
              Compatible con impresoras láser, inkjet y fotocopiadoras. Resma de 500 hojas tamaño A5,
              gramaje de 80 gramos, extra blanco.
            </p>

            <div className="flex items-center gap-3">
              <label style={{ color: "var(--color-primary-text)" }}>Cantidad:</label>
              <select
                className="w-16 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2
                           focus:ring-[var(--color-primary-bg)]"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                style={{
                  color: "var(--color-primary-text)",
                  background: "var(--surface, #ffffff)",
                  borderColor: "var(--border, #d1d5db)",
                }}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddToCart}
                className="cursor-pointer px-4 py-2 rounded text-sm transition-colors"
                style={{
                  background: "var(--color-primary-bg)",
                  color: "var(--color-tertiary-text)",
                }}
                onMouseEnter={(e) => ((e.currentTarget.style.background = "var(--color-secondary-bg)"))}
                onMouseLeave={(e) => ((e.currentTarget.style.background = "var(--color-primary-bg)"))}
              >
                Agregar
              </button>
            </div>

            <div className="text-sm space-y-1 pt-4">
              <p>
                <strong>SKU:</strong> <span style={{ color: "var(--color-secondary-text)" }}>FWM15VKT</span>
              </p>
              <p>
                <strong>Etiquetas:</strong>{" "}
                <span style={{ color: "var(--color-secondary-text)" }}>
                  {product.tags?.length ? product.tags.join(", ") : "Sin etiquetas"}
                </span>
              </p>
              <p>
                <strong>Stock:</strong>{" "}
                <span style={{ color: "var(--color-secondary-text)" }}>{product.stock} unidades</span>
              </p>
              <p>
                <strong>Fabricación:</strong>{" "}
                <span style={{ color: "var(--color-secondary-text)" }}>{product.mfg}</span>
              </p>
              <p>
                <strong>Vida útil:</strong>{" "}
                <span style={{ color: "var(--color-secondary-text)" }}>{product.life}</span>
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6 pb-[3rem]"
          style={{ borderColor: "var(--border, #e5e7eb)" }}
        >
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--color-primary-text)" }}>
            Descripción
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-secondary-text)" }}>
            Esta resma de papel A5 de 80 gramos contiene 500 hojas de alta blancura y calidad premium,
            diseñadas para ofrecer un rendimiento confiable en todo tipo de impresoras y fotocopiadoras.
            Su textura uniforme garantiza resultados nítidos tanto en impresión como en escritura manual.
            Ideal para el uso en oficinas, hogares y centros educativos.
          </p>
        </div>

        <ProductCardGrid products={mockProducts} />
      </section>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 rounded px-6 py-3 shadow-lg z-50"
            style={{ background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)" }}
          >
            Producto agregado al carrito 🛒
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
