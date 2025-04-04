import { useState, useEffect } from 'react';
import { useUserStore } from '../stores/userStore';
import { User, Role } from '../types';
import { ROLE_LABELS } from '../lib/permissions';
import { Button } from '../components/ui/Button';
import { Users, Shield, Settings, Trash2, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/Tooltip";

export function AdminDashboard() {
  const { hasPermission, updateUserRole, deleteUser, error: storeError, fetchUsers } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      setLoading(true);
      setError(null);
      await updateUserRole(userId, newRole);
      await loadUsers(); // Reload users after role change
    } catch (error) {
      console.error('Failed to update user role:', error);
      setError('Failed to update user role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteUser(userId);
      await loadUsers(); // Reload users after deletion
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage users and system settings</p>
        </div>

        {(error || storeError) && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error || storeError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Stats Cards */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Roles</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(ROLE_LABELS).length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">System Status</p>
                <p className="text-2xl font-bold text-gray-900">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsers}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Fraud Detection
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {selectedUser === user.id ? (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                            disabled={loading}
                            className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {Object.entries(ROLE_LABELS).map(([role, label]) => (
                              <option key={role} value={role}>
                                {label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                            {ROLE_LABELS[user.role]}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {user.createdAt.toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {user.fraudulent_bids && user.fraudulent_bids.length > 0 ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center text-yellow-600">
                                  <AlertTriangle className="h-5 w-5" />
                                  <span className="ml-1 text-sm font-medium">
                                    {user.fraudulent_bids.length} suspicious activity
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="max-w-xs">
                                  <p className="font-medium mb-2">Excessive bidding detected:</p>
                                  <ul className="text-sm">
                                    {user.fraudulent_bids.map((bid, index) => (
                                      <li key={index} className="mb-1">
                                        Item #{bid.item_id}: {bid.count} bids (more than 5 bids on a single item)
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-green-600 text-sm">No suspicious activity</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                            disabled={loading}
                          >
                            {selectedUser === user.id ? 'Cancel' : 'Edit Role'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
}