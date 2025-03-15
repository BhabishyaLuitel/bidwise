import { create } from 'zustand';
import { Bid } from '../types';

interface BidState {
  bids: Record<string, Bid[]>;
  currentBid: Record<string, number>;
  addBid: (itemId: string, bid: Bid) => void;
  updateCurrentBid: (itemId: string, amount: number) => void;
  getBids: (itemId: string) => Bid[];
  getCurrentBid: (itemId: string) => number;
}

export const useBidStore = create<BidState>((set, get) => ({
  bids: {},
  currentBid: {},
  
  addBid: (itemId, bid) => set((state) => ({
    bids: {
      ...state.bids,
      [itemId]: [...(state.bids[itemId] || []), bid].sort((a, b) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      ),
    },
  })),
  
  updateCurrentBid: (itemId, amount) => set((state) => ({
    currentBid: {
      ...state.currentBid,
      [itemId]: amount,
    },
  })),
  
  getBids: (itemId) => get().bids[itemId] || [],
  
  getCurrentBid: (itemId) => get().currentBid[itemId] || 0,
}));