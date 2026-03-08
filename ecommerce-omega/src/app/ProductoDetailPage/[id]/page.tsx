"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductCardGrid, {
  Product,
} from "@/components/ProductCardGrid/ProductCardGrid";
import Navbar from "@/components/NavigationBar/NavBar";
import Footer from "@/components/Footer/Footer";
import ProductReviews from "@/components/ProductReviews/ProductReviews";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/utils/CartUtils";

interface DetailProducts extends Product {
  description: string;
  stock: number;
  sku?: string;
  tags: string[];
  mfg: string;
  life: string;
  badgeText?: string | null;
  badgeColor?: string | null;
  galleryUrls?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants?: any[];
}



export default function ProductoDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<DetailProducts | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const thumbnails = product 
    ? [product.imageUrl, ...(product.galleryUrls || [])].filter(url => Boolean(url))
    : [];

  useEffect(() => {
    const id = Array.isArray(params?.id)
      ? params.id[0]
      : (params?.id as string | undefined);

    let abort = false;
    const controller = new AbortController();

    async function fetchProductById(productId?: string) {
      if (!productId) {
        setApiError("No se proporcionó ID de producto.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setApiError(null);

      try {
        const res = await fetch(
          `/api/products/${encodeURIComponent(productId)}`,
          {
            method: "GET",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (abort) return;

        if (res.ok) {
          const data: DetailProducts = await res.json();
          setProduct(data);
          setSelectedImage(data.imageUrl ?? null);
          
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }

          // Obtener dinámicamente el promedio real de las reseñas en cuanto carga
          fetch(`/api/products/${encodeURIComponent(productId)}/reviews`)
            .then(r => r.json())
            .then(d => {
              if (d.averageRating) setAverageRating(d.averageRating);
            }).catch(() => {});

        } else {
          setApiError(`No se encontró el producto (status ${res.status}).`);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setApiError("Error al conectar con la API.");
      } finally {
        if (!abort) setLoading(false);
      }
    }

    fetchProductById(id);

    return () => {
      abort = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Fetch para productos relacionados (grid). Si falla, usamos mockProducts
  useEffect(() => {
    const id = Array.isArray(params?.id)
      ? params.id[0]
      : (params?.id as string | undefined);

    let abort = false;
    const controller = new AbortController();

    async function fetchRelated(productId?: string) {
      setRelatedError(null);

      if (!productId) {
        return;
      }

      try {
        const res = await fetch(
          `/api/products?relatedTo=${encodeURIComponent(productId)}`,
          {
            method: "GET",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (abort) return;

        if (res.ok) {
          const data: Product[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRelatedProducts(data);
          } else {
            setRelatedProducts([]);
          }
        } else {
          setRelatedProducts([]);
          setRelatedError(`No se encontraron productos relacionados (status ${res.status}).`);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setRelatedProducts([]);
        setRelatedError("Error al conectar con la API de productos relacionados.");
      }
    }

    fetchRelated(id);

    return () => {
      abort = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const stockDisponible = selectedVariant !== null ? selectedVariant.stock : product.stock;
    if (quantity > stockDisponible) {
      alert("Lo sentimos, no hay suficiente stock disponible para esta cantidad.");
      return;
    }

    addToCart(
      {
        id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
        productId: product.id,
        variantId: selectedVariant?.id,
        title: selectedVariant ? `${product.title} (${selectedVariant.name})` : product.title,
        imageUrl: product.imageUrl,
        price: selectedVariant?.price ? Number(selectedVariant.price) : product.currentPrice,
      },
      quantity
    );
    window.dispatchEvent(new Event("cartUpdated"));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  if (!product && loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-medium">Cargando producto...</p>
      </div>
    );
  }
  if (!product) return <div className="p-6">Producto no encontrado</div>;

  return (
    <div
      className="min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)] relative"
      style={{ background: "var(--bgweb)", color: "var(--color-primary-text)" }}
    >
      <Navbar />

      <section className="px-6 py-10 max-w-6xl mx-auto">
        {/* Mensajes de fallo */}
        {apiError && (
          <div className="mb-4 text-sm p-2 rounded" style={{ background: 'var(--surface, #fefce8)', color: 'var(--accent-warning, #a16207)' }}>
            {apiError}
          </div>
        )}
        {relatedError && (
          <div className="mb-4 text-sm p-2 rounded" style={{ background: 'var(--surface, #fefce8)', color: 'var(--accent-warning, #a16207)' }}>
            {relatedError}
          </div>
        )}

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
            {(product.badgeText || product.oldPrice > product.currentPrice) && (
              <span
                className={`text-xs px-2 py-1 rounded-full w-fit font-semibold tracking-wide ${
                  product.badgeColor || ""
                }`}
                style={
                  !product.badgeColor
                    ? {
                        background: "var(--badge-bg, #fee2e2)",
                        color: "var(--badge-text, #ef4444)",
                      }
                    : {}
                }
              >
                {product.badgeText 
                  ? product.badgeText 
                  : `-${Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100)}% OFF`}
              </span>
            )}

            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--color-primary-text)" }}
            >
              {product.title}
            </h1>

            <p
              className="text-sm"
              style={{ color: "var(--accent-warning, #eab308)" }}
            >
              ★ {averageRating || product.rating}
            </p>

            <div className="flex items-center gap-3">
              <span
                className="text-3xl font-bold"
                style={{ color: "var(--color-primary-bg)" }}
              >
                ${selectedVariant?.price ? Number(selectedVariant.price) : product.currentPrice}
              </span>
              {(product.oldPrice > (selectedVariant?.price ? Number(selectedVariant.price) : product.currentPrice)) && (
                <span
                  className="line-through text-sm"
                  style={{ color: "var(--color-secondary-text)" }}
                >
                  ${product.oldPrice}
                </span>
              )}
            </div>

            <p
              className="text-sm max-w-lg"
              style={{ color: "var(--color-secondary-text)" }}
            >
              {product.description}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-semibold" style={{ color: "var(--color-primary-text)" }}>
                  Opciones Disponibles:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const outOfStock = v.stock <= 0;
                    return (
                      <button
                        key={v.id}
                        disabled={outOfStock}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 text-sm rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-[var(--color-primary-bg)] bg-[var(--color-primary-bg)] text-[var(--color-tertiary-text)] font-semibold shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                        } ${outOfStock ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer"}`}
                      >
                        {v.name} {outOfStock && "(Agotado)"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <label style={{ color: "var(--color-primary-text)" }}>
                Cantidad:
              </label>
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-secondary-bg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--color-primary-bg)")
                }
              >
                Agregar
              </button>
            </div>

            <div className="text-sm space-y-1 pt-4">
              <p>
                <strong>SKU:</strong>{" "}
                <span style={{ color: "var(--color-secondary-text)" }}>
                  {product.sku || 'N/A'}
                </span>
              </p>
              <p>
                <strong>Etiquetas:</strong>{" "}
                <span style={{ color: "var(--color-secondary-text)" }}>
                  {product.tags?.length
                    ? product.tags.join(", ")
                    : "Sin etiquetas"}
                </span>
              </p>
              <p>
                <strong>Stock:</strong>{" "}
                <span style={{ color: "var(--color-secondary-text)" }}>
                  {product.stock} unidades
                </span>
              </p>
              <p>
                <strong>Fabricación:</strong>{" "}
                <span style={{ color: "var(--color-secondary-text)" }}>
                  {product.mfg}
                </span>
              </p>
              <p>
                <strong>Vida útil:</strong>{" "}
                <span style={{ color: "var(--color-secondary-text)" }}>
                  {product.life}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6 pb-[3rem]"
          style={{ borderColor: "var(--border, #e5e7eb)" }}
        >
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--color-primary-text)" }}
          >
            Descripción
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-secondary-text)" }}
          >
            {product.description || "Este producto no tiene una descripción detallada cargada."}
          </p>
        </div>

        {/* Sección de Reseñas de Clientes */}
        <ProductReviews productId={product.id} />

        {/* ProductCardGrid recibe un array: relatedProducts */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 mb-8 border-t pt-8" style={{ borderColor: "var(--border, #e5e7eb)" }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-primary-text)" }}>También te podría interesar...</h2>
            <ProductCardGrid products={relatedProducts} />
          </div>
        )}
      </section>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 rounded px-6 py-3 shadow-lg z-50"
            style={{
              background: "var(--color-primary-bg)",
              color: "var(--color-tertiary-text)",
            }}
          >
            Producto agregado al carrito 🛒
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
