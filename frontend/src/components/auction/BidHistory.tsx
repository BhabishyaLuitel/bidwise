import { useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { User } from 'lucide-react';
import { useBidStore } from '../../stores/bidStore';
import { formatPrice } from '../../lib/utils';
import { Bid } from '../../types';

interface BidHistoryProps {
  itemId: string;
  bids: Bid[];
}

export function BidHistory({ itemId, bids }: BidHistoryProps) {
  const { addBid } = useBidStore();

  useEffect(() => {
    bids.forEach(bid => addBid(itemId, bid));
  }, [itemId, bids, addBid]);

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <div key={bid.id} className="flex items-center justify-between border-b pb-4 last:border-0">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{bid.username}</p>
              <p className="text-xs text-gray-500">
                {formatDistance(bid.timestamp, new Date(), { addSuffix: true })}
              </p>
            </div>
          </div>
          <p className="font-medium text-gray-900">{formatPrice(bid.amount)}</p>
        </div>
      ))}
      
      {bids.length === 0 && (
        <p className="text-center text-gray-500">No bids yet</p>
      )}
    </div>
  );
}