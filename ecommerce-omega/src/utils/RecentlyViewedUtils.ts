// src/utils/RecentlyViewedUtils.ts

export interface RecentlyViewedItem {
  id: string;
  title: string;
  imageUrl: string;
  currentPrice: number;
  oldPrice: number;
  category?: string;
  rating: number;
  brand: string;
}

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 12;

function getStored(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function save(items: RecentlyViewedItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addRecentlyViewed(product: RecentlyViewedItem): void {
  const list = getStored().filter((item) => item.id !== product.id);
  list.unshift(product); // most recent first
  save(list.slice(0, MAX_ITEMS));
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  return getStored();
}
