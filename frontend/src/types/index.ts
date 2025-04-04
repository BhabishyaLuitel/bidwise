export type Role = 'buyer' | 'seller' | 'admin';

export type Permission = 
  | 'create:listing'
  | 'edit:listing'
  | 'delete:listing'
  | 'manage:users'
  | 'manage:roles'
  | 'view:admin_dashboard'
  | 'place:bid';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  permissions: Permission[];
  createdAt: Date;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  stats?: {
    totalBids: number;
    wonAuctions: number;
    activeListings: number;
    completedSales: number;
    rating: number;
    reviewCount: number;
  };
  fraudulent_bids?: Array<{
    item_id: string;
    count: number;
  }>;
}

export type Item = {
  id: string;
  title: string;
  description: string;
  images: string[];
  startingPrice: number;
  currentBid: number;
  sellerId: string;
  category: string;
  endTime: Date;
  status: 'active' | 'ended' | 'sold';
  totalBids: number;
  createdAt: Date;
  updatedAt?: Date;
};

export type Bid = {
  id: string;
  itemId: string;
  userId: string;
  amount: number;
  timestamp: Date;
};

export type NotificationType = 'bid' | 'outbid' | 'won' | 'ended' | 'payment' | 'system';

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  itemId?: string;
  read: boolean;
  timestamp: Date;
};