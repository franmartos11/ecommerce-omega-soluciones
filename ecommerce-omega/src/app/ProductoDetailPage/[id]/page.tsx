"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCardGrid, { Product } from "@/app/Components/ProductCardGrid/ProductCardGrid";
import Navbar from "@/app/Components/NavigationBar/NavBar";
import Footer from "@/app/Components/Footer/Footer";

import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/utils/CartUtils";

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Resma Papel A5 x500 Hoja 80gr",
    imageUrl: "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
    currentPrice: 5849,
    oldPrice: 6290,
    rating: 4.5,
    seller: "Ledesma",
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
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showPopup, setShowPopup] = useState(false);

  const thumbnails = [
    product?.imageUrl || "",
    "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
    "https://arcencohogar.vtexassets.com/arquivos/ids/351229-1200-1200?v=638174404648170000&width=1200&height=1200&aspect=true",
  ];

  useEffect(() => {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
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
    window.dispatchEvent(new Event('cartUpdated'));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  if (!product) return <div className="p-6">Producto no encontrado</div>;
  


  return (
    <div className="bg-white min-h-screen p-8 pb-0 font-[family-name:var(--font-geist-sans)] relative">
      <Navbar />
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10">
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
                  className={`cursor-pointer rounded-lg border-2 ${
                    selectedImage === thumb ? "border-green-500" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full w-fit">
              Sale Off
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-yellow-500 text-sm">★ {product.rating} (32 reviews)</p>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-green-600">
                ${product.currentPrice}
              </span>
              <span className="line-through text-gray-400 text-sm">${product.oldPrice}</span>
            </div>

            <p className="text-sm text-gray-600 max-w-lg">
              Papel multifunción de alta calidad, ideal para impresiones claras y profesionales. Compatible con impresoras láser, inkjet y fotocopiadoras. Resma de 500 hojas tamaño A5, gramaje de 80 gramos, extra blanco.
            </p>

            <div className="flex items-center text-black gap-3">
              <label>Cantidad:</label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <button
                onClick={handleAddToCart}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
              >
                Agregar
              </button>
            </div>

            <div className="text-sm text-gray-800 space-y-1 pt-4">
              <p><strong>SKU:</strong> FWM15VKT</p>
              <p><strong>Etiquetas:</strong> {product.tags?.length ? product.tags.join(", ") : "Sin etiquetas"}</p>
              <p><strong>Stock:</strong> {product.stock} unidades</p>
              <p><strong>Fabricación:</strong> {product.mfg}</p>
              <p><strong>Vida útil:</strong> {product.life}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 pb-[3rem]">
          <h2 className="text-lg font-semibold text-black mb-2">Descripción</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Esta resma de papel A5 de 80 gramos contiene 500 hojas de alta blancura y calidad premium, diseñadas para ofrecer un rendimiento confiable en todo tipo de impresoras y fotocopiadoras. Su textura uniforme garantiza resultados nítidos tanto en impresión como en escritura manual. Ideal para el uso en oficinas, hogares y centros educativos.
          </p>
        </div>
        <ProductCardGrid products={mockProducts}></ProductCardGrid>
      </section>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50"
          >
            Producto agregado al carrito 🛒
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
