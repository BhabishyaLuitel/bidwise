import { useState, useEffect } from 'react';
import { Plus, Package, DollarSign, Timer, Trash2, Edit, Eye, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { formatPrice, getTimeLeft } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useListingStore } from '../stores/listingStore';
import { useUserStore } from '../stores/userStore';
import { itemsApi } from '../lib/api/items';
import type { Item } from '../lib/api/items';
import toast from 'react-hot-toast';

interface DashboardStats {
  activeListings: number;
  totalBids: number;
  totalEarnings: number;
  endingSoon: number;
}

export function SellerDashboard() {
  const { user } = useUserStore();
  const { deleteItem } = useListingStore();
  const [selectedTab, setSelectedTab] = useState<'active' | 'ended'>('active');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await itemsApi.getSellerItems();
        setItems(response.data);
      } catch (error) {
        console.error('Failed to fetch seller items:', error);
        toast.error('Failed to load your listings');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchItems();
    }
  }, [user]);

  const stats: DashboardStats = {
    activeListings: items.filter(item => item.status === 'active').length,
    totalBids: items.reduce((acc, item) => acc + item.totalBids, 0),
    totalEarnings: items
      .filter(item => item.status === 'sold')
      .reduce((acc, item) => acc + item.currentBid, 0),
    endingSoon: items.filter(item => 
      item.status === 'active' && 
      (new Date(item.endTime).getTime() - Date.now()) < 24 * 60 * 60 * 1000
    ).length,
  };

  const filteredItems = items.filter(item => 
    selectedTab === 'active' ? item.status === 'active' : item.status === 'ended'
  );

  const handleDelete = async (itemId: string) => {
    try {
      setDeletingItem(itemId);
      await itemsApi.delete(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      setShowDeleteConfirm(null);
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
      console.error('Failed to delete listing:', error);
    } finally {
      setDeletingItem(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your auctions and track your sales</p>
          </div>
          <Link to="/sell/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Listing
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalEarnings)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Timer className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Ending Soon</p>
                <p className="text-2xl font-bold text-gray-900">{stats.endingSoon}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Bids</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('active')}
              className={`border-b-2 pb-4 text-sm font-medium ${
                selectedTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Listings
            </button>
            <button
              onClick={() => setSelectedTab('ended')}
              className={`border-b-2 pb-4 text-sm font-medium ${
                selectedTab === 'ended'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Ended Listings
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Current Bid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Time Left
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Bids
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{formatPrice(item.currentBid)}</div>
                    <div className="text-sm text-gray-500">
                      Started at {formatPrice(item.startingPrice)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {getTimeLeft(new Date(item.endTime))}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {item.totalBids} bids
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/marketplace/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/sell/edit/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(item.id)}
                        disabled={deletingItem === item.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No {selectedTab} listings found</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Delete Listing</h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={deletingItem !== null}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deletingItem !== null}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deletingItem === showDeleteConfirm ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}