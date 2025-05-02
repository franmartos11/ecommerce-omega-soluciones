// src/utils/cartUtils.ts
export interface CartItem {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    quantity: number;
  }
  
  /**
   * Lee el carrito desde localStorage (o devuelve array vacío).
   */
  export function getCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  }
  
  /**
   * Guarda el carrito completo en localStorage.
   */
  function saveCart(cart: CartItem[]) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  /**
   * Agrega un producto al carrito (o suma cantidad si ya existe).
   */
  export function addToCart(
    product: Omit<CartItem, "quantity">,
    qty: number = 1
  ) {
    const cart = getCart();
    const idx = cart.findIndex((i) => i.id === product.id);
    if (idx >= 0) {
      cart[idx].quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    saveCart(cart);
  }
  
  /**
   * Elimina un ítem por completo.
   */
  export function removeFromCart(id: string) {
    const cart = getCart().filter((i) => i.id !== id);
    saveCart(cart);
  }
  
  /**
   * Actualiza la cantidad (mínimo 1).
   */
  export function updateCartQty(id: string, qty: number) {
    const cart = getCart().map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
    );
    saveCart(cart);
  }
  
  /**
   * Limpia todo el carrito.
   */
  export function clearCart() {
    saveCart([]);
  }
  