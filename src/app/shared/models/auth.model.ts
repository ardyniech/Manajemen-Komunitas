export interface AuthUser {
  id: string;
  memberNumber: string;
  fullName: string;
  email: string;
  phone: string;
  roleCode: 'super_admin' | 'ketua' | 'bendahara' | 'moderator' | 'anggota';
  roleTitle: string;
  tier: 'reguler' | 'pengurus' | 'vip' | 'alumni';
  avatarUrl: string;
  bio?: string;
  address?: string;
  joinedAt: string;
  duesPaidUntil: string;
  twoFactorActive: boolean;
  emergencyContact?: string;
  chapter?: string;
  skills?: string[];
  vehicleNumber?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  loginAt: string;
  device: string;
  ipAddress: string;
}
