import { FC } from "react";
import ProductCard, { ProductCardProps } from "../ProductCard/ProductCard";


export interface Product extends ProductCardProps {
  id: string;
}

interface ProductCardGridProps {
  products: Product[];
}

const ProductCardGrid: FC<ProductCardGridProps> = ({ products }) => {
  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">En Promo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(({ id, ...product }) => (
          <ProductCard key={id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCardGrid;
