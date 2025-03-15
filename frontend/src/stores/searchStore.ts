import { create } from 'zustand';

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),
}));