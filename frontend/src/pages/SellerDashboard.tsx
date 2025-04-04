import { useState } from 'react';
import { Plus, Package, DollarSign, Timer, Trash2, Edit, Eye, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { formatPrice, getTimeLeft } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useListingStore } from '../stores/listingStore';
import { useUserStore } from '../stores/userStore';
import toast from 'react-hot-toast';
import { API_URL, API_URL_STORAGE } from '../lib/api/api';
import { useSellerItems, useDeleteItem } from '../hooks/useItems';
import { cn } from '../lib/utils';
import type { Item } from '../lib/api/items';

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
  
  const { data: items = [], isLoading } = useSellerItems();
  const deleteItemMutation = useDeleteItem();

  const stats: DashboardStats = {
    activeListings: items.filter((item: Item) => item.status === 'active').length,
    totalBids: items.reduce((acc: number, item: Item) => acc + item.totalBids, 0),
    totalEarnings: items
      .filter((item: Item) => item.status === 'sold')
      .reduce((acc: number, item: Item) => acc + item.currentBid, 0),
    endingSoon: items.filter((item: Item) => 
      item.status === 'active' && 
      (new Date(item.endTime).getTime() - Date.now()) < 24 * 60 * 60 * 1000
    ).length,
  };

  const filteredItems = items.filter((item: Item) => 
    selectedTab === 'active' ? item.status === 'active' : item.status === 'ended'
  );

  const handleDelete = async (itemId: string) => {
    try {
      setDeletingItem(itemId);
      await deleteItemMutation.mutateAsync(itemId);
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
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading your listings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <Link to="/seller/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Listings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bids</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalEarnings)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Timer className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ending Soon</p>
                <p className="text-2xl font-bold text-gray-900">{stats.endingSoon}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('active')}
              className={cn(
                'border-b-2 py-4 px-1 text-sm font-medium',
                selectedTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              Active Listings
            </button>
            <button
              onClick={() => setSelectedTab('ended')}
              className={cn(
                'border-b-2 py-4 px-1 text-sm font-medium',
                selectedTab === 'ended'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              Ended Listings
            </button>
          </nav>
        </div>

        {/* Items List */}
        <div className="rounded-lg bg-white shadow-sm">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No listings</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedTab === 'active'
                  ? 'You have no active listings. Create one to get started.'
                  : 'You have no ended listings.'}
              </p>
              {selectedTab === 'active' && (
                <div className="mt-6">
                  <Link to="/seller/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Listing
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Current Bid
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Time Left
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredItems.map((item: Item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={API_URL_STORAGE + item.images[0]}
                              alt={item.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.totalBids} bids</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item.currentBid)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                            item.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'ended'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                          )}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {item.status === 'active' ? (
                          <div className="flex items-center">
                            <Timer className="mr-1 h-4 w-4" />
                            {getTimeLeft(new Date(item.endTime))}
                          </div>
                        ) : (
                          'Ended'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/marketplace/${item.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          {item.status === 'active' && (
                            <>
                              <Link
                                to={`/seller/edit/${item.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => setShowDeleteConfirm(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Delete Listing</h3>
            </div>
            <p className="mb-6 text-gray-500">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deletingItem === showDeleteConfirm}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deletingItem === showDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                {deletingItem === showDeleteConfirm ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}