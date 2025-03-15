import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { placeBid } from '../../lib/socket';
import { formatPrice } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface BidFormProps {
  itemId: string;
  currentBid: number;
  minimumBid: number;
}

export function BidForm({ itemId, currentBid, minimumBid }: BidFormProps) {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleBid = () => {
    if (!user) {
      navigate('/auth', { state: { from: `/marketplace/${itemId}` } });
      return;
    }

    if (!hasPermission('place:bid')) {
      setError('You do not have permission to place bids');
      return;
    }

    const amount = Number(bidAmount);
    
    if (isNaN(amount) || amount < minimumBid) {
      setError(`Minimum bid amount is ${formatPrice(minimumBid)}`);
      return;
    }

    setError(null);
    placeBid(itemId, amount);
    setBidAmount('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Your Bid (Minimum {formatPrice(minimumBid)})
        </label>
        <div className="relative mt-1">
          <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => {
              setBidAmount(e.target.value);
              setError(null);
            }}
            className="block w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={`Enter amount (USD)`}
          />
        </div>
        {error && (
          <p className="mt-2 flex items-center text-sm text-red-600">
            <AlertCircle className="mr-1 h-4 w-4" />
            {error}
          </p>
        )}
      </div>
      <Button onClick={handleBid} className="w-full">
        {user ? 'Place Bid' : 'Sign In to Bid'}
      </Button>
    </div>
  );
}