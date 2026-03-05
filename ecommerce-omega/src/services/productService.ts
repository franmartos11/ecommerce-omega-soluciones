import { Product } from "@/components/ProductCardGrid/ProductCardGrid";

/**
 * Servicio para manejar llamadas a la API de productos.
 * Encapsula la lógica de fetching para limpiar los componentes.
 */
export async function fetchProducts(): Promise<Product[] | null> {
  try {
    const res = await fetch("/api/products", {
      next: { revalidate: 60 } // Cache for 1 min
    });
    
    if (!res.ok) {
      console.warn("Error fetching products from API, falling back to config.json");
      return null;
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return null;
  }
}
