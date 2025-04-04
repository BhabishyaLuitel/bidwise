// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// For direct responses without the ApiResponse wrapper
export interface DirectResponse<T> {
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginResponse {
  token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    permissions: string[];
    created_at: string;
    avatar?: string | null;
    bio?: string | null;
    location?: string | null;
    phone?: string | null;
  };
}

export interface RegisterResponse {
  token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    permissions: string[];
    created_at: string;
    avatar?: string | null;
    bio?: string | null;
    location?: string | null;
    phone?: string | null;
  };
}

// Item Types
export interface ItemResponse {
  id: string;
  title: string;
  description: string;
  images: string[];
  startingPrice: number;
  currentBid: number;
  minimumBidIncrement: number;
  seller: {
    id: string;
    username: string;
    rating: number;
  };
  category: string;
  endTime: string;
  status: 'active' | 'ended' | 'sold';
  totalBids: number;
  createdAt: string;
  updatedAt: string;
  highestBidder?: {
    id: string;
    username: string;
  };
}

// Bid Types
export interface BidResponse {
  id: string;
  amount: number;
  bidder: {
    id: string;
    username: string;
  };
  item: {
    id: string;
    title: string;
  };
  timestamp: string;
}

// User Types
export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  created_at: string;
  stats?: {
    totalBids: number;
    wonAuctions: number;
    activeListings: number;
    completedSales: number;
    rating: number;
    reviewCount: number;
  };
}

// Filter Types
export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}