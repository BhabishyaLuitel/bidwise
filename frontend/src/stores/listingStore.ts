import { create } from 'zustand';
import { Item } from '../types';
import { MOCK_ITEMS } from '../pages/MarketplacePage';

interface ListingState {
  items: Item[];
  setItems: (items: Item[]) => void;
  updateItem: (id: string, data: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Item | undefined;
  getSellerItems: (sellerId: string) => Item[];
}

export const useListingStore = create<ListingState>((set, get) => ({
  items: MOCK_ITEMS,
  
  setItems: (items) => set({ items }),
  
  updateItem: (id, data) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, ...data } : item
    ),
  })),
  
  deleteItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  
  getItem: (id) => get().items.find((item) => item.id === id),
  
  getSellerItems: (sellerId) => get().items.filter((item) => item.sellerId === sellerId),
}));