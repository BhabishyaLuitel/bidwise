import { api } from './api';
import { useUserStore } from '../../stores/userStore';
import { ApiResponse } from './types';

export interface BidResponse {
  id: string;
  item_id: string;
  user_id: string;
  amount: number;
  timestamp: string;
  status: string;
  user: {
    id: string;
    username: string;
  };
  item: {
    id: string;
    title: string;
    current_bid: number;
  };
}

export interface CreateBidResponse {
  message: string;
  bid: BidResponse;
  next_minimum_bid: number;
}

const getAuthHeader = () => {
  const token = useUserStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const bidsApi = {
  create: (itemId: string, amount: number) =>
    api.post<CreateBidResponse>(`/items/${itemId}/bids`, { amount }, {
      headers: getAuthHeader()
    }),

  getByItem: (itemId: string) =>
    api.get<ApiResponse<BidResponse[]>>(`/items/${itemId}/bids`, {
      headers: getAuthHeader()
    }),

  getUserBids: () =>
    api.get<ApiResponse<BidResponse[]>>('/bids', {
      headers: getAuthHeader()
    }),

  getActiveBids: () =>
    api.get<ApiResponse<BidResponse[]>>('/bids/active', {
      headers: getAuthHeader()
    }),

  getWonBids: () =>
    api.get<ApiResponse<BidResponse[]>>('/bids/won', {
      headers: getAuthHeader()
    }),

  getOutbidBids: () =>
    api.get<ApiResponse<BidResponse[]>>('/bids/outbid', {
      headers: getAuthHeader()
    }),

  getLostBids: () =>
    api.get<ApiResponse<BidResponse[]>>('/bids/lost', {
      headers: getAuthHeader()
    }),

  delete: (bidId: string) =>
    api.delete<ApiResponse<void>>(`/bids/${bidId}`, {
      headers: getAuthHeader()
    }),
}; 