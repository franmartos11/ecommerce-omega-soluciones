'use client'
import { FC, useState } from "react";
import ProductCard, { ProductCardProps } from "../ProductCard/ProductCard";
import { motion } from "framer-motion";

export interface Product extends ProductCardProps {
  color: string;
  condition: string;
  id: string;
}

interface ProductCardGridProps {
  products: Product[];
}

const ProductCardGrid: FC<ProductCardGridProps> = ({ products }) => {
  const [visibleCount, setVisibleCount] = useState(16);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 16);
  };

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-black text-2xl font-semibold mb-6 ">En Promo</h2>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            
              <ProductCard {...product} />
            
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleLoadMore}
            className=" cursor-pointer px-6 py-2 bg-bg1 text-white rounded-lg shadow-md hover:bg-bg2 transition text-sm font-medium"
          >
            Cargar más
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ProductCardGrid;
