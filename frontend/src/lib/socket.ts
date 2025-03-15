import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const SOCKET_URL = 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('bid_placed', ({ itemId, amount, bidder }) => {
  toast.success(`New bid: ${amount} by ${bidder}`);
});

socket.on('outbid', ({ itemId, amount }) => {
  toast.error(`You've been outbid! Current bid: ${amount}`);
});

socket.on('auction_ended', ({ itemId, winner }) => {
  toast.success(`Auction ended! Winner: ${winner}`);
});

export const connectSocket = (userId: string) => {
  socket.auth = { userId };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const joinAuctionRoom = (itemId: string) => {
  socket.emit('join_auction', { itemId });
};

export const leaveAuctionRoom = (itemId: string) => {
  socket.emit('leave_auction', { itemId });
};

export const placeBid = (itemId: string, amount: number) => {
  socket.emit('place_bid', { itemId, amount });
};