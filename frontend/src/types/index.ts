export type User = {
  id: string;
  username: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: Date;
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
};

export type Bid = {
  id: string;
  itemId: string;
  userId: string;
  amount: number;
  timestamp: Date;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'bid' | 'outbid' | 'won' | 'ended' | 'payment';
  message: string;
  read: boolean;
  timestamp: Date;
};

export type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  error: string | null;
};