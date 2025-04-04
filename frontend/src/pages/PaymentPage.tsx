import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '../components/ui/Button';
import { CreditCard, Loader2 } from 'lucide-react';
import { usePaymentDetails, usePaymentIntent } from '../hooks/usePayments';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred');
        setProcessing(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now
          </>
        )}
      </Button>
    </form>
  );
}

export function PaymentPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const { data: paymentDetails, isLoading: isLoadingPayment, error: paymentError } = usePaymentDetails(paymentId || '');
  const { data: paymentIntent, isLoading: isLoadingIntent } = usePaymentIntent(paymentId || '');

  if (isLoadingPayment || isLoadingIntent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (paymentError || !paymentDetails || !paymentIntent?.clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{paymentError?.message || 'Payment not found'}</p>
          <Button onClick={() => navigate('/profile')}>
            Return to Profile
          </Button>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret: paymentIntent.clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Payment
            </h1>

            <div className="mb-6">
              <h2 className="font-medium text-gray-900">{paymentDetails.itemName}</h2>
              <p className="text-sm text-gray-600">
                Due by {new Date(paymentDetails.dueDate).toLocaleDateString()}
              </p>
            </div>

            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
} 