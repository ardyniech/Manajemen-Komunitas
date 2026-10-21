import { signal } from '@angular/core';
import { AuthUser, AuthSession } from '../../shared/models/auth.model';
import { membersState, persistAll } from '../../shared/utils/storage';
import { activeUserContext, switchActiveRole } from '../rbac.service';
import { dispatcher } from '../dispatcher';
import { Member } from '../../shared/models/member.model';
import { DEFAULT_AUTH_USER, INITIAL_AUTH_SESSIONS } from './auth-defaults';

export const isAuthenticated = signal<boolean>(true);
export const currentUser = signal<AuthUser>(DEFAULT_AUTH_USER);
export const activeSessions = signal<AuthSession[]>(INITIAL_AUTH_SESSIONS);

export function loginUser(email: string, password?: string): boolean {
  void password;
  const members = membersState();
  const found = members.find(m => m.email.toLowerCase() === email.toLowerCase());
  
  const roleMap: Record<string, 'super_admin' | 'ketua' | 'bendahara' | 'moderator' | 'anggota'> = {
    'role-superadmin': 'super_admin',
    'role-ketua': 'ketua',
    'role-bendahara': 'bendahara',
    'role-moderator': 'moderator',
    'role-anggota': 'anggota'
  };

  const roleCode = found ? (roleMap[found.roleId] || 'anggota') : 'super_admin';
  const updatedUser: AuthUser = found ? {
    id: found.id,
    memberNumber: found.memberNumber,
    fullName: found.fullName,
    email: found.email,
    phone: found.phone,
    roleCode,
    roleTitle: found.tier === 'pengurus' ? 'Pengurus Komunitas' : 'Anggota Resmi',
    tier: found.tier,
    avatarUrl: found.avatarUrl,
    bio: found.notes || 'Anggota aktif komunitas Komunika OS.',
    address: 'Indonesia',
    joinedAt: found.joinedAt,
    duesPaidUntil: found.duesPaidUntil,
    twoFactorActive: found.twoFactorActive,
    chapter: 'Wilayah Barat',
    skills: ['Komunikasi', 'Kolaborasi']
  } : DEFAULT_AUTH_USER;

  currentUser.set(updatedUser);
  isAuthenticated.set(true);
  switchActiveRole(updatedUser.roleCode);
  dispatcher.emit('USER_LOGGED_IN', updatedUser, 'auth');
  return true;
}

export function registerUser(data: Partial<AuthUser>): AuthUser {
  const newMemberId = `mem-${Date.now()}`;
  const memberNum = `KOM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newMember: Member = {
    id: newMemberId,
    memberNumber: memberNum,
    fullName: data.fullName || 'Anggota Baru',
    email: data.email || 'user@komunika.id',
    phone: data.phone || '081200000000',
    roleId: 'role-anggota',
    tier: data.tier || 'reguler',
    status: 'aktif',
    joinedAt: new Date().toISOString().split('T')[0],
    avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    duesPaidUntil: '2026-12-31',
    twoFactorActive: false,
    notes: data.bio || 'Pendaftaran mandiri melalui portal publik.'
  };

  membersState.update(list => [newMember, ...list]);
  persistAll();

  const user: AuthUser = {
    ...newMember,
    roleCode: 'anggota',
    roleTitle: 'Anggota Resmi',
    bio: data.bio || 'Anggota baru di Komunika OS',
    address: data.address || 'Indonesia',
    chapter: data.chapter || 'Umum',
    skills: data.skills || ['Anggota']
  };

  currentUser.set(user);
  isAuthenticated.set(true);
  switchActiveRole('anggota');
  dispatcher.emit('USER_REGISTERED', user, 'auth');
  return user;
}

export function updateAuthProfile(changes: Partial<AuthUser>): void {
  currentUser.update(prev => ({ ...prev, ...changes }));
  const curr = currentUser();

  activeUserContext.update(prev => ({
    ...prev,
    name: curr.fullName,
    email: curr.email,
    avatarUrl: curr.avatarUrl
  }));

  membersState.update(list => list.map(m => m.id === curr.id ? {
    ...m,
    fullName: curr.fullName,
    email: curr.email,
    phone: curr.phone,
    avatarUrl: curr.avatarUrl,
    notes: curr.bio
  } : m));

  persistAll();
  dispatcher.emit('PROFILE_UPDATED', curr, 'profile');
}

export function logoutUser(): void {
  isAuthenticated.set(false);
  dispatcher.emit('USER_LOGGED_OUT', null, 'auth');
}
