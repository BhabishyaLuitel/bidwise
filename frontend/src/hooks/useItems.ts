import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi, Item, FilterParams } from '../lib/api/items';
import { useToastStore } from '../stores/toastStore';

export function useItems(params: FilterParams = {}) {
  return useQuery({
    queryKey: ['items', params],
    queryFn: async () => {
      const response = await itemsApi.getAll(params);
      return response.data;
    },
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const response = await itemsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useFeaturedItems() {
  return useQuery({
    queryKey: ['featured-items'],
    queryFn: async () => {
      const response = await itemsApi.featured();
      return response.data;
    },
  });
}

export function useSellerItems() {
  return useQuery({
    queryKey: ['seller-items'],
    queryFn: async () => {
      const response = await itemsApi.getSellerItems();
      return response.data;
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await itemsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      addToast('success', 'Item created successfully!');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['seller-items'] });
    },
    onError: (error: any) => {
      // Error toast is already shown by the API interceptor
      console.error('Error creating item:', error);
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const response = await itemsApi.update(id, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      addToast('success', 'Item updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
      queryClient.invalidateQueries({ queryKey: ['seller-items'] });
    },
    onError: (error: any) => {
      // Error toast is already shown by the API interceptor
      console.error('Error updating item:', error);
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await itemsApi.delete(id);
      return response.data;
    },
    onSuccess: (_, id) => {
      addToast('success', 'Item deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
      queryClient.invalidateQueries({ queryKey: ['seller-items'] });
    },
    onError: (error: any) => {
      // Error toast is already shown by the API interceptor
      console.error('Error deleting item:', error);
    },
  });
} 