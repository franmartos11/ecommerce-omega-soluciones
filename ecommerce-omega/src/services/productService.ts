import { Product } from "@/components/ProductCardGrid/ProductCardGrid";

/**
 * Servicio para manejar llamadas a la API de productos.
 * Encapsula la lógica de fetching para limpiar los componentes.
 */
export async function fetchProducts(): Promise<Product[] | null> {
  // TODO: reemplaza por tu llamada real a la API (Ej: Firebase)
  // Por ahora devolvemos null para que el fallback del config.json tome el control
  return null;
}
