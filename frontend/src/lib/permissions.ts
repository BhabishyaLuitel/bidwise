import { Role, Permission } from '../types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'create:listing',
    'edit:listing',
    'delete:listing',
    'manage:users',
    'manage:roles',
    'view:admin_dashboard',
    'place:bid'
  ],
  seller: [
    'create:listing',
    'edit:listing',
    'delete:listing',
    'place:bid'
  ],
  buyer: [
    'place:bid'
  ]
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  seller: 'Seller',
  buyer: 'Buyer'
};

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function checkPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission);
}