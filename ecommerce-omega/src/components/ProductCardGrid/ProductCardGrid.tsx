'use client'
import { FC, useState, useMemo } from "react";
import ProductCard, { ProductCardProps } from "../ProductCard/ProductCard";
import { ProductGridSkeleton } from "../Skeletons/ProductSkeleton";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Product extends ProductCardProps {
  color?: string;
  condition?: string;
  mfg?: string;
  tags?: string[];
  stock: number;
  id: string;
}

interface ProductCardGridProps {
  products: Product[];
  loading?: boolean;
}

const ITEMS_PER_PAGE = 16;

const ProductCardGrid: FC<ProductCardGridProps> = ({ products, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const visibleProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to show (max 5 visible)
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="w-full">
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
          <p className="text-lg font-medium">No se encontraron productos</p>
          <p className="text-sm">Intentá con otros filtros o términos de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {visibleProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex w-full h-full"
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 mt-10">
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
              style={{ color: "var(--color-primary-text)" }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                  style={{ color: "var(--color-primary-text)" }}
                >
                  1
                </button>
                {pageNumbers[0] > 2 && <span className="px-1 text-gray-400">…</span>}
              </>
            )}

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  page === currentPage
                    ? "shadow-sm"
                    : "border border-gray-200 hover:bg-gray-100"
                }`}
                style={
                  page === currentPage
                    ? { background: "var(--color-primary-bg)", color: "var(--color-tertiary-text)" }
                    : { color: "var(--color-primary-text)" }
                }
              >
                {page}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
                <button
                  onClick={() => goToPage(totalPages)}
                  className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                  style={{ color: "var(--color-primary-text)" }}
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
              style={{ color: "var(--color-primary-text)" }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <p className="text-xs" style={{ color: "var(--color-secondary-text)" }}>
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, products.length)} de {products.length} productos
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCardGrid;
