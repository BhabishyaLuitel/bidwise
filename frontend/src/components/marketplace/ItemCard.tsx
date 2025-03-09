import { Heart, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Item } from '../../types';
import { formatPrice, getTimeLeft } from '../../lib/utils';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link to={`/marketplace/${item.id}`} className="group relative rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={item.images[0]}
          alt={item.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <button 
          className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Implement favorite functionality
          }}
        >
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{item.title}</h3>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Bid</p>
            <p className="text-lg font-bold text-blue-600">
              {formatPrice(item.currentBid)}
            </p>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Timer className="mr-1 h-4 w-4" />
            {getTimeLeft(item.endTime)}
          </div>
        </div>
      </div>
    </Link>
  );
}