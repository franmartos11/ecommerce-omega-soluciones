// src/utils/WishlistUtils.ts

export interface WishlistItem {
  id: string;
  title: string;
  imageUrl: string;
  currentPrice: number;
  oldPrice: number;
  category?: string;
  rating: number;
  brand: string;
}

const STORAGE_KEY = "wishlist";

function getStoredWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveWishlist(items: WishlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  // Dispatch event for other components to react
  window.dispatchEvent(new Event("wishlistUpdated"));
}

export function getWishlist(): WishlistItem[] {
  return getStoredWishlist();
}

export function isInWishlist(productId: string): boolean {
  return getStoredWishlist().some((item) => item.id === productId);
}

export function addToWishlist(product: WishlistItem): void {
  const list = getStoredWishlist();
  if (!list.some((item) => item.id === product.id)) {
    list.push(product);
    saveWishlist(list);
  }
}

export function removeFromWishlist(productId: string): void {
  const list = getStoredWishlist().filter((item) => item.id !== productId);
  saveWishlist(list);
}

export function toggleWishlist(product: WishlistItem): boolean {
  if (isInWishlist(product.id)) {
    removeFromWishlist(product.id);
    return false; // removed
  } else {
    addToWishlist(product);
    return true; // added
  }
}

export function getWishlistCount(): number {
  return getStoredWishlist().length;
}
