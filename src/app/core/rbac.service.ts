import { signal, computed } from '@angular/core';
import { UserRole, AppPermission } from '../shared/models/role.model';
import { rolesState } from '../shared/utils/storage';

export interface ActiveUserContext {
  id: string;
  name: string;
  email: string;
  roleCode: 'super_admin' | 'ketua' | 'bendahara' | 'moderator' | 'anggota';
  avatarUrl: string;
}

export const activeUserContext = signal<ActiveUserContext>({
  id: 'mem-001',
  name: 'Arya Pratama',
  email: 'arya.pratama@komunika.id',
  roleCode: 'super_admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
});

export const currentUserRole = computed<UserRole | undefined>(() => {
  const code = activeUserContext().roleCode;
  return rolesState().find(r => r.code === code);
});

export const currentUserPermissions = computed<AppPermission[]>(() => {
  const role = currentUserRole();
  return role ? role.permissions : [];
});

export function hasAppPermission(permission: AppPermission): boolean {
  if (activeUserContext().roleCode === 'super_admin') return true;
  return currentUserPermissions().includes(permission);
}

export function switchActiveRole(roleCode: 'super_admin' | 'ketua' | 'bendahara' | 'moderator' | 'anggota'): void {
  const usersByRole: Record<string, { id: string; name: string; email: string; avatarUrl: string }> = {
    super_admin: {
      id: 'mem-001',
      name: 'Arya Pratama',
      email: 'arya.pratama@komunika.id',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    ketua: {
      id: 'mem-003',
      name: 'Dimas Setiawan',
      email: 'dimas.dev@yahoo.co.id',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    bendahara: {
      id: 'mem-002',
      name: 'Siti Rahmawati',
      email: 'siti.rahma@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    moderator: {
      id: 'mem-004',
      name: 'Anisa Larasati',
      email: 'anisa.laras@outlook.com',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    anggota: {
      id: 'mem-006',
      name: 'Rizky Fauzi',
      email: 'rizky.fauzi@techmail.id',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
    }
  };

  const user = usersByRole[roleCode] || usersByRole['anggota'];
  activeUserContext.set({
    ...user,
    roleCode
  });
}
