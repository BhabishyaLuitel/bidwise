import { create } from 'zustand';
import { Item } from '../types';

const MOCK_ITEMS: Item[] = [
  {
    id: 'item1',
    title: 'Item 1',
    description: 'Description 1',
    images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    startingPrice: 100,
    currentBid: 100,
    sellerId: 'user1',
    category: 'Category 1',
    endTime: new Date(Date.now() + 86400000),
    status: 'active',
    totalBids: 0,
    createdAt: new Date()
  },
];

interface ListingState {
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Item | undefined;
  getSellerItems: (sellerId: string) => Item[];
}

export const useListingStore = create<ListingState>((set, get) => ({
  items: MOCK_ITEMS,
  
  addItem: (item) => {
    set((state) => ({
      items: [...state.items, item],
    }));
  },
  
  updateItem: (id, updatedItem) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    }));
  },
  
  deleteItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  
  getItem: (id) => {
    return get().items.find((item) => item.id === id);
  },
  
  getSellerItems: (sellerId) => {
    return get().items.filter((item) => item.sellerId === sellerId);
  },
}));