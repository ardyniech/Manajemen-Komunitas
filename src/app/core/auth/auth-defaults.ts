import { AuthUser, AuthSession } from '../../shared/models/auth.model';

export const DEFAULT_AUTH_USER: AuthUser = {
  id: 'mem-001',
  memberNumber: 'KOM-2026-0001',
  fullName: 'Arya Pratama',
  email: 'arya.pratama@komunika.id',
  phone: '081234567890',
  roleCode: 'super_admin',
  roleTitle: 'Super Administrator',
  tier: 'pengurus',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Arsitek sistem & penggerak transformasi digital komunitas.',
  address: 'Jakarta Selatan, DKI Jakarta',
  joinedAt: '2026-01-10',
  duesPaidUntil: '2026-12-31',
  twoFactorActive: true,
  emergencyContact: '081299887766 (Istri)',
  chapter: 'Jabodetabek & Banten',
  skills: ['Manajemen Organisasi', 'Pengembangan Komunitas', 'Keuangan'],
  vehicleNumber: 'B 1234 KOM'
};

export const INITIAL_AUTH_SESSIONS: AuthSession[] = [
  {
    token: 'tok-curr-991',
    user: DEFAULT_AUTH_USER,
    loginAt: '2026-09-18 06:00 WIB',
    device: 'Chrome 128 / macOS Sonoma',
    ipAddress: '182.253.12.89 (Jakarta)'
  },
  {
    token: 'tok-mobile-442',
    user: DEFAULT_AUTH_USER,
    loginAt: '2026-09-17 19:40 WIB',
    device: 'Komunika PWA / Android 14',
    ipAddress: '114.124.201.55 (Bandung)'
  }
];
