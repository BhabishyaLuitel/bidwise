import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Item } from '../types';
import { ItemCard } from '../components/marketplace/ItemCard';
import { Button } from '../components/ui/Button';

const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Collectibles',
  'Fashion',
  'Home & Garden',
  'Art',
  'Sports',
  'Vehicles',
  'Jewelry',
];

export const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    title: 'Vintage Rolex Submariner',
    description: 'Original 1960s Rolex Submariner in excellent condition',
    images: ['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=800&q=80'],
    startingPrice: 15000,
    currentBid: 16500,
    sellerId: 'seller1',
    category: 'Jewelry',
    endTime: new Date(Date.now() + 172800000), // 48 hours from now
    status: 'active',
  },
  {
    id: '2',
    title: 'Apple MacBook Pro M2',
    description: 'Latest model MacBook Pro with M2 chip, 16GB RAM, 512GB SSD',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
    startingPrice: 1200,
    currentBid: 1350,
    sellerId: 'seller2',
    category: 'Electronics',
    endTime: new Date(Date.now() + 86400000), // 24 hours from now
    status: 'active',
  },
  {
    id: '3',
    title: 'Rare Pokemon Card Collection',
    description: 'First edition holographic cards including Charizard',
    images: ['https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80'],
    startingPrice: 5000,
    currentBid: 6200,
    sellerId: 'seller3',
    category: 'Collectibles',
    endTime: new Date(Date.now() + 259200000), // 72 hours from now
    status: 'active',
  },
];

export function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = MOCK_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesPrice = item.currentBid >= priceRange[0] && item.currentBid <= priceRange[1];
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="mt-2 text-gray-600">Discover unique items and place your bids</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[240px,1fr]">
          <div className={`space-y-6 rounded-lg bg-white p-6 shadow-sm ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">No items found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}