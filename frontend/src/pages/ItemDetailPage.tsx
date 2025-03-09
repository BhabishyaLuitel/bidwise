import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, User, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { formatPrice, getTimeLeft } from '../lib/utils';
import { MOCK_ITEMS } from './MarketplacePage';

interface BidHistory {
  id: string;
  userId: string;
  username: string;
  amount: number;
  timestamp: Date;
}

const MOCK_BIDS: BidHistory[] = [
  {
    id: 'bid1',
    userId: 'user1',
    username: 'JohnDoe',
    amount: 16500,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'bid2',
    userId: 'user2',
    username: 'JaneSmith',
    amount: 16000,
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: 'bid3',
    userId: 'user3',
    username: 'BobWilson',
    amount: 15500,
    timestamp: new Date(Date.now() - 10800000),
  },
];

export function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidError, setShowBidError] = useState(false);

  const item = MOCK_ITEMS.find((item) => item.id === id);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          Item not found
        </div>
      </div>
    );
  }

  const handleBid = () => {
    const amount = Number(bidAmount);
    if (amount <= item.currentBid) {
      setShowBidError(true);
      return;
    }
    // TODO: Implement bid submission
    setShowBidError(false);
    setBidAmount('');
  };

  const minimumBid = item.currentBid + 100; // Minimum increment of $100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/marketplace')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <img
                src={item.images[selectedImage]}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.title} - Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Current Bid</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(item.currentBid)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Time Left</p>
                  <div className="flex items-center text-gray-900">
                    <Clock className="mr-1 h-4 w-4" />
                    {getTimeLeft(item.endTime)}
                  </div>
                </div>
              </div>

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
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={`Enter amount (USD)`}
                    />
                  </div>
                  {showBidError && (
                    <p className="mt-2 flex items-center text-sm text-red-600">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      Bid must be higher than current bid
                    </p>
                  )}
                </div>
                <Button onClick={handleBid} className="w-full">
                  Place Bid
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Bid History</h2>
              <div className="space-y-4">
                {MOCK_BIDS.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{bid.username}</p>
                        <p className="text-sm text-gray-500">
                          {bid.timestamp.toLocaleDateString()} {bid.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">{formatPrice(bid.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}