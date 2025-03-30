import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Item } from '../types';
import { ItemCard } from '../components/marketplace/ItemCard';
import { Button } from '../components/ui/Button';
import { useSearchStore } from '../stores/searchStore';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { itemsApi, FilterParams } from '../lib/api/items';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, isSearching, setQuery } = useSearchStore();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: FilterParams = {
          search: query,
          category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          sort: selectedSort !== 'newest' ? selectedSort : undefined,
          minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
          maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
          page: pagination.currentPage,
          perPage: pagination.perPage,
        };

        const response = await itemsApi.getAll(params);
        setItems(response.data.data);
        setPagination({
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          perPage: response.data.per_page,
          total: response.data.total,
        });
      } catch (err) {
        setError('Failed to fetch items. Please try again later.');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [query, selectedCategory, selectedStatus, selectedSort, priceRange, pagination.currentPage]);

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

  if (loading) {
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
            {error}
          </div>
        </div>
      </div>
    );
  }

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
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active Filters:</span>
            {activeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => clearFilter(filter)}
                className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                {filter}
                <X className="ml-1 h-4 w-4" />
              </button>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="mb-8 grid gap-6 lg:grid-cols-[240px,1fr]">
          <div className={cn(
            "space-y-6 rounded-lg bg-white p-6 shadow-sm",
            showFilters ? 'block' : 'hidden lg:block'
          )}>
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
              <h3 className="mb-4 font-semibold text-gray-900">Status</h3>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
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
            {items.map((item) => (
              <div key={item.id} onClick={() => handleBidClick(item.id)}>
                <ItemCard item={item} />
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">No items found matching your criteria</p>
              </div>
            )}
          </div>
        </div>

        {pagination.lastPage > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium",
                    pagination.currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}