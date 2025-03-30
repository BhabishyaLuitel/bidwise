import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Role } from '../types';
import { ROLE_LABELS } from '../lib/permissions';
import { Button } from '../components/ui/Button';
import { Users, Shield, Settings } from 'lucide-react';

const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'buyer',
    permissions: ['place:bid'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    username: 'janesmith',
    email: 'jane@example.com',
    role: 'seller',
    permissions: ['create:listing', 'edit:listing', 'delete:listing', 'place:bid'],
    createdAt: new Date('2024-02-01'),
  },
];

export function AdminDashboard() {
  const { hasPermission, updateUserRole } = useAuth();
  const [users, setUsers] = useState(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      setLoading(true);
      await updateUserRole(userId, newRole);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Failed to update user role:', error);
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
                <p className="text-2xl font-bold text-gray-900">3</p>
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
          <h2 className="mb-6 text-xl font-semibold text-gray-900">User Management</h2>
          
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
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      >
                        {selectedUser === user.id ? 'Cancel' : 'Edit Role'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}