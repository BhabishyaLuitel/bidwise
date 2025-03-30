import { api } from './api';

export interface Item {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  startingPrice: number;
  currentBid: number;
  totalBids: number;
  status: 'active' | 'ended' | 'sold';
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface CreateItemData {
  title: string;
  description: string;
  category: string;
  starting_price: number;
  duration: number;
  images: string[];
}

interface UpdateItemData {
  title: string;
  description: string;
  category: string;
  starting_price: number;
  images: string[];
}

export const itemsApi = {
  getAll: (params: FilterParams) =>
    api.get<PaginatedResponse<Item>>('/items', { params }),

  getById: (id: string) =>
    api.get<Item>(`/items/${id}`),

  create: async (data: FormData) => {
    const response = await api.post('/items', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  update: (id: string, data: FormData) => 
    api.put<Item>(`/items/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  delete: (id: string) => api.delete(`/items/${id}`),

  getSellerItems: () => api.get<Item[]>('/seller/items'),

  featured: () => api.get<{ data: Array<{
    id: string;
    title: string;
    image: string;
    currentBid: number;
    timeLeft: string;
  }> }>('/items/featured'),
}; 