import api from './config';
import type {
  ApiResponse,
  PaginatedResponse,
  LoginResponse,
  RegisterResponse,
  ItemResponse,
  BidResponse,
  UserProfileResponse,
  FilterParams,
} from './types';

// Auth Endpoints
export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<LoginResponse>>('/login', { email, password }),

  register: (data: { email: string; password: string; username: string; role: string }) =>
    api.post<ApiResponse<RegisterResponse>>('/register', data),

  logout: () => api.post('/logout'),

  refreshToken: () => api.post<ApiResponse<{ token: string }>>('/refresh'),
};

// Items/Listings Endpoints
export const itemsApi = {
  getAll: (params: FilterParams) =>
    api.get<PaginatedResponse<ItemResponse>>('/items', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<ItemResponse>>(`/items/${id}`),

  create: (data: FormData) =>
    api.post<ApiResponse<ItemResponse>>('/items', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: FormData) =>
    api.put<ApiResponse<ItemResponse>>(`/items/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/items/${id}`),

  getSellerItems: (sellerId: string, params: FilterParams) =>
    api.get<PaginatedResponse<ItemResponse>>(`/sellers/${sellerId}/items`, { params }),
};

// Bids Endpoints
export const bidsApi = {
  create: (itemId: string, amount: number) =>
    api.post<ApiResponse<BidResponse>>(`/items/${itemId}/bids`, { amount }),

  getByItem: (itemId: string) =>
    api.get<ApiResponse<BidResponse[]>>(`/items/${itemId}/bids`),

  getUserBids: (userId: string) =>
    api.get<PaginatedResponse<BidResponse>>(`/users/${userId}/bids`),
};

// User Endpoints
export const userApi = {
  getProfile: () =>
    api.get<ApiResponse<UserProfileResponse>>('/users/profile'),

  updateProfile: (data: Partial<UserProfileResponse>) =>
    api.put<ApiResponse<UserProfileResponse>>('/users/profile', data),

  updateRole: (userId: string, role: string) =>
    api.put<ApiResponse<void>>(`/users/${userId}/role`, { role }),

  getAll: (params?: { role?: string; search?: string }) =>
    api.get<PaginatedResponse<UserProfileResponse>>('/users', { params }),
};