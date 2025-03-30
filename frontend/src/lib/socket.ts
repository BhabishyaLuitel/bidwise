import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

window.Pusher = Pusher;

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  host: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
  port: import.meta.env.VITE_REVERB_PORT ? parseInt(import.meta.env.VITE_REVERB_PORT) : 6001,
  scheme: import.meta.env.VITE_REVERB_SCHEME || 'http',
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
  auth: {
    headers: {
      'X-CSRF-TOKEN': csrfToken,
      'Accept': 'application/json',
    }
  }
});

export const subscribeToItemBids = (itemId: string, callback: (bid: any) => void) => {
  window.Echo.private(`item.${itemId}`)
    .listen('.bid.placed', (event: any) => {
      callback(event.bid);
      toast.success(`New bid: ${event.bid.amount} by ${event.bid.user.username}`);
    })
    .listen('.bid.outbid', (event: any) => {
      toast.error(`You've been outbid! Current bid: ${event.amount}`);
    })
    .listen('.auction.ended', (event: any) => {
      toast.success(`Auction ended! Winner: ${event.winner}`);
    });
};

export const unsubscribeFromItemBids = (itemId: string) => {
  window.Echo.leave(`item.${itemId}`);
};