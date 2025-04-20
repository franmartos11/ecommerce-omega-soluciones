'use client'
import { FC } from "react";
import ProductCard, { ProductCardProps } from "../ProductCard/ProductCard";
import Link from "next/link";

export interface Product extends ProductCardProps {
  color: string;
  condition: string;
  id: string;
}

interface ProductCardGridProps {
  products: Product[];
}

const ProductCardGrid: FC<ProductCardGridProps> = ({ products }) => {
  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-black text-2xl font-semibold mb-4">En Promo</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/ProductoDetailPage/${product.id}`}
            className="block focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg"
          >
            <ProductCard {...product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductCardGrid;
