export type Role = 'buyer' | 'seller' | 'admin';

export type Permission = 
  | 'create:listing'
  | 'edit:listing'
  | 'delete:listing'
  | 'manage:users'
  | 'manage:roles'
  | 'view:admin_dashboard'
  | 'place:bid';

export type User = {
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
  totalBids?: number;
  wonAuctions?: number;
  activeListings?: number;
  completedSales?: number;
  rating?: number;
  reviewCount?: number;
};

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

export type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, role: Role) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateUserRole: (userId: string, role: Role) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
};