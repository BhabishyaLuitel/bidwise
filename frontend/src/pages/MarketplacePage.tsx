import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ItemCard } from '../components/marketplace/ItemCard';
import { Button } from '../components/ui/Button';
import { useSearchStore } from '../stores/searchStore';
import { useUserStore } from '../stores/userStore';
import { cn } from '../lib/utils';
import { FilterParams } from '../lib/api/items';
import { useItems } from '../hooks/useItems';
import { Item } from '../types';

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

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Ending Soon', value: 'ending' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Bids', value: 'bids' },
];

const STATUS_OPTIONS = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Ending Soon', value: 'ending_soon' },
  { label: 'Ended', value: 'ended' },
];

export function MarketplacePage() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, isSearching, setQuery } = useSearchStore();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 12,
    total: 0,
  });

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = searchParams.get('page');

    if (searchQuery) setQuery(searchQuery);
    if (category) setSelectedCategory(category);
    if (status) setSelectedStatus(status);
    if (sort) setSelectedSort(sort);
    if (minPrice && maxPrice) {
      setPriceRange([Number(minPrice), Number(maxPrice)]);
    }
    if (page) {
      setPagination(prev => ({ ...prev, currentPage: Number(page) }));
    }
  }, [searchParams, setQuery]);

  useEffect(() => {
    const filters: string[] = [];
    if (selectedCategory !== 'All Categories') filters.push(selectedCategory);
    if (selectedStatus !== 'all') filters.push(selectedStatus);
    if (priceRange[0] > 0 || priceRange[1] < 50000) filters.push('Price Range');
    if (query) filters.push('Search');
    setActiveFilters(filters);
  }, [selectedCategory, selectedStatus, priceRange, query]);

  const filterParams: FilterParams = {
    search: query,
    category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    sort: selectedSort !== 'newest' ? selectedSort : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
    page: pagination.currentPage,
    perPage: pagination.perPage,
  };

  const { data: itemsData, isLoading, error } = useItems(filterParams);

  useEffect(() => {
    if (itemsData) {
      setPagination({
        currentPage: itemsData.current_page,
        lastPage: itemsData.last_page,
        perPage: itemsData.per_page,
        total: itemsData.total,
      });
    }
  }, [itemsData]);

  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (query) newParams.set('search', query);
    if (selectedCategory !== 'All Categories') newParams.set('category', selectedCategory);
    if (selectedStatus !== 'all') newParams.set('status', selectedStatus);
    if (selectedSort !== 'newest') newParams.set('sort', selectedSort);
    if (priceRange[0] > 0) newParams.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 50000) newParams.set('maxPrice', priceRange[1].toString());
    if (pagination.currentPage > 1) newParams.set('page', pagination.currentPage.toString());
    
    setSearchParams(newParams, { replace: true });
  }, [query, selectedCategory, selectedStatus, selectedSort, priceRange, pagination.currentPage, setSearchParams]);

  const clearFilter = (filter: string) => {
    switch (filter) {
      case 'Search':
        setQuery('');
        break;
      case selectedCategory:
        setSelectedCategory('All Categories');
        break;
      case selectedStatus:
        setSelectedStatus('all');
        break;
      case 'Price Range':
        setPriceRange([0, 50000]);
        break;
    }
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategory('All Categories');
    setSelectedStatus('all');
    setPriceRange([0, 50000]);
    setSelectedSort('newest');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleBidClick = (itemId: string) => {
    if (!user) {
      navigate('/auth', { state: { from: `/marketplace/${itemId}` } });
    } else {
      navigate(`/marketplace/${itemId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading items...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            Failed to fetch items. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  const items = itemsData?.data || [];

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
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSearching(true);
              }}
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2',
                showFilters && 'bg-gray-100'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter}
                className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                <span>{filter}</span>
                <button
                  onClick={() => clearFilter(filter)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all
            </button>
          </div>
        )}

        {showFilters && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sort By
                </label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onBidClick={() => handleBidClick(item.id)}
            />
          ))}
        </div>

        {items.length === 0 && !isLoading && (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <p className="text-gray-500">No items found matching your criteria.</p>
          </div>
        )}

        {pagination.lastPage > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: Math.max(1, prev.currentPage - 1),
                  }))
                }
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-gray-600">
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: Math.min(prev.lastPage, prev.currentPage + 1),
                  }))
                }
                disabled={pagination.currentPage === pagination.lastPage}
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}