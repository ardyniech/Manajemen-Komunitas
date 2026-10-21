import { Member } from '../shared/models/member.model';
import { UserRole } from '../shared/models/role.model';
import { CommunitySettings } from '../shared/models/integration.model';
import { IMPORTED_COMMUNITY_MEMBERS } from './community-members-data';

export const INITIAL_COMMUNITY_SETTINGS: CommunitySettings = {
  communityName: 'Komunitas Pengembang & Kreatif Indonesia',
  tagline: 'Wadah Sinergi Talenta Digital, Inovasi & Edukasi Terbuka',
  establishedDate: '2023-01-15',
  contactEmail: 'sekretariat@komunika.id',
  contactPhone: '+62 812-3456-7890',
  address: 'Gedung Kolaborasi Lt. 4, Jl. Rasuna Said, Jakarta Selatan',
  monthlyDuesNominal: 50000,
  currency: 'IDR',
  bankName: 'Bank Central Asia (BCA)',
  bankAccountNumber: '8720-9988-1122',
  bankAccountHolder: 'KAS BESAR KOMUNIKA',
  autoBackupIntervalHours: 12,
  e2eeDefault: true
};

export const INITIAL_ROLES: UserRole[] = [
  {
    id: 'role-superadmin',
    code: 'super_admin',
    name: 'Super Administrator',
    description: 'Akses tanpa batas ke seluruh modul sistem, peran, dan backup',
    color: '#dc2626',
    permissions: ['manage_members', 'manage_finance', 'moderate_forum', 'export_reports', 'manage_roles', 'manage_settings', 'trigger_backup'],
    isSystemDefault: true,
    memberCount: 2
  },
  {
    id: 'role-ketua',
    code: 'ketua',
    name: 'Ketua Komunitas',
    description: 'Memimpin koordinasi anggota, menyetujui program, dan audit',
    color: '#4f46e5',
    permissions: ['manage_members', 'view_finance', 'moderate_forum', 'export_reports', 'manage_settings'],
    isSystemDefault: true,
    memberCount: 1
  },
  {
    id: 'role-bendahara',
    code: 'bendahara',
    name: 'Bendahara Kas',
    description: 'Mengelola buku kas, verifikasi transfer iuran, dan ekspor laporan keuangan',
    color: '#059669',
    permissions: ['view_members', 'manage_finance', 'export_reports'],
    isSystemDefault: true,
    memberCount: 2
  },
  {
    id: 'role-moderator',
    code: 'moderator',
    name: 'Pengurus / Moderator',
    description: 'Mengelola tata tertib forum diskusi dan kurasi keanggotaan baru',
    color: '#d97706',
    permissions: ['view_members', 'moderate_forum', 'post_forum'],
    isSystemDefault: true,
    memberCount: 4
  },
  {
    id: 'role-anggota',
    code: 'anggota',
    name: 'Anggota Umum',
    description: 'Berpartisipasi aktif dalam forum diskusi dan pembayaran iuran bulanan',
    color: '#64748b',
    permissions: ['view_members', 'view_finance', 'post_forum'],
    isSystemDefault: true,
    memberCount: 57
  }
];

export const INITIAL_MEMBERS: Member[] = [...IMPORTED_COMMUNITY_MEMBERS];
