import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bidsApi, BidResponse } from '../lib/api/bids';
import { useToastStore } from '../stores/toastStore';

export function useItemBids(itemId: string) {
  return useQuery({
    queryKey: ['item-bids', itemId],
    queryFn: async () => {
      const response = await bidsApi.getByItem(itemId);
      return response.data;
    },
    enabled: !!itemId,
  });
}

export function useUserBids() {
  return useQuery({
    queryKey: ['user-bids'],
    queryFn: async () => {
      const response = await bidsApi.getUserBids();
      return response.data;
    },
  });
}

export function useActiveBids() {
  return useQuery({
    queryKey: ['active-bids'],
    queryFn: async () => {
      const response = await bidsApi.getActiveBids();
      return response.data;
    },
  });
}

export function useCreateBid() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  
  return useMutation({
    mutationFn: async ({ itemId, amount }: { itemId: string; amount: number }) => {
      try {
        const response = await bidsApi.create(itemId, amount);
        return response.data;
      } catch (error: any) {
        // Check if this is a duplicate bid error
        if (error.response?.data?.message?.includes('Duplicate entry')) {
          throw new Error('You have already placed a bid on this item. To place a new bid, it must be higher than your previous bid.');
        }
        throw error;
      }
    },
    onSuccess: (data, { itemId }) => {
      // Show success toast
      addToast('success', 'Bid placed successfully!');
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['item-bids', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['user-bids'] });
      queryClient.invalidateQueries({ queryKey: ['active-bids'] });
    },
    onError: (error: any) => {
      // Error toast is already shown by the API interceptor
      console.error('Error creating bid:', error);
    },
  });
} 