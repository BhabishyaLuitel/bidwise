import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/config';

interface Payment {
  id: string;
  amount: number;
  itemName: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

interface PaymentIntent {
  clientSecret: string;
}

export function usePaymentDetails(paymentId: string) {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      const { data } = await api.get<Payment>(`/payments/${paymentId}`);
      return data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function usePaymentIntent(paymentId: string) {
  return useQuery({
    queryKey: ['paymentIntent', paymentId],
    queryFn: async () => {
      const { data } = await api.post<PaymentIntent>(`/payments/${paymentId}/setup-intent`);
      return data;
    },
    enabled: !!paymentId, // Only run query if paymentId exists
  });
}

export function useUserPayments() {
  return useQuery({
    queryKey: ['userPayments'],
    queryFn: async () => {
      const { data } = await api.get<Payment[]>('/payments');
      return data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, status }: { paymentId: string; status: string }) => {
      const { data } = await api.put(`/payments/${paymentId}/status`, { status });
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch payment queries
      queryClient.invalidateQueries({ queryKey: ['userPayments'] });
      queryClient.invalidateQueries({ queryKey: ['payment'] });
    },
  });
} 