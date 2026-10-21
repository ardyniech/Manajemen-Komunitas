import { signal } from '@angular/core';

export type PageId =
  | 'dashboard' | 'profile' | 'members' | 'member-register' | 'member-kta' | 'member-import'
  | 'events' | 'gamification' | 'leaderboard' | 'talent-placement'
  | 'finance' | 'finance-entry' | 'finance-receipts' | 'finance-qris' | 'finance-reports' | 'member-dues-recap'
  | 'forum' | 'forum-new' | 'forum-thread'
  | 'analytics' | 'roles' | 'settings' | 'security'
  | 'integrations' | 'api-sandbox' | 'api-docs' | 'cloud-backup';

export interface NavTreeChild {
  pageId: PageId;
  label: string;
  icon: string;
  badge?: string;
  adminOnly?: boolean;
}

export interface NavTreeNode {
  id: string;
  label: string;
  icon: string;
  pageId?: PageId;
  children?: NavTreeChild[];
  adminOnly?: boolean;
  badge?: string;
}

export const NAV_TREE: NavTreeNode[] = [
  { id: 'dashboard', label: 'Ringkasan', icon: 'grid_view', pageId: 'dashboard' },
  { id: 'profile', label: 'Profil Saya', icon: 'account_circle', pageId: 'profile', badge: 'KTA' },
  { id: 'events', label: 'Kalender & Agenda', icon: 'event', pageId: 'events', badge: 'RSVP' },
  {
    id: 'grp-gamification',
    label: 'Poin & Kontribusi',
    icon: 'stars',
    pageId: 'gamification',
    children: [
      { pageId: 'gamification', label: 'Pusat Misi & Poin XP', icon: 'stars' },
      { pageId: 'leaderboard', label: 'Papan Peringkat (Top 10)', icon: 'leaderboard' }
    ]
  },
  {
    id: 'grp-members',
    label: 'Keanggotaan',
    icon: 'groups',
    pageId: 'members',
    children: [
      { pageId: 'members', label: 'Direktori Anggota', icon: 'people_alt' },
      { pageId: 'member-register', label: 'Pendaftaran Anggota', icon: 'person_add' },
      { pageId: 'member-kta', label: 'Studio KTA Digital', icon: 'badge' },
      { pageId: 'member-import', label: 'Impor Masal CSV', icon: 'upload_file', adminOnly: true }
    ]
  },
  { id: 'talent-placement', label: 'Dewan Etik & Penempatan', icon: 'gavel', pageId: 'talent-placement', adminOnly: true, badge: 'Etik' },
  {
    id: 'grp-finance',
    label: 'Kas & Iuran',
    icon: 'account_balance_wallet',
    pageId: 'finance',
    children: [
      { pageId: 'finance', label: 'Buku Kas Utama', icon: 'receipt_long' },
      { pageId: 'finance-entry', label: 'Catat Transaksi', icon: 'add_circle_outline' },
      { pageId: 'finance-receipts', label: 'Kuitansi Digital', icon: 'receipt' },
      { pageId: 'finance-qris', label: 'Bayar QRIS Cepat', icon: 'qr_code_2' },
      { pageId: 'finance-reports', label: 'Laporan Keuangan', icon: 'analytics' },
      { pageId: 'member-dues-recap', label: 'Rekap Kas WhatsApp', icon: 'chat' }
    ]
  },
  {
    id: 'grp-forum',
    label: 'Forum Diskusi',
    icon: 'forum',
    pageId: 'forum',
    children: [
      { pageId: 'forum', label: 'Semua Diskusi', icon: 'chat' },
      { pageId: 'forum-new', label: 'Buat Topik Baru', icon: 'post_add' }
    ]
  },
  { id: 'analytics', label: 'Dasbor Analitik', icon: 'insights', pageId: 'analytics' },
  { id: 'roles', label: 'Hak Akses & Peran', icon: 'admin_panel_settings', pageId: 'roles', adminOnly: true },
  { id: 'settings', label: 'Profil Komunitas', icon: 'domain', pageId: 'settings', adminOnly: true },
  { id: 'security', label: 'Keamanan & 2FA', icon: 'lock_outline', pageId: 'security', adminOnly: true },
  {
    id: 'grp-integrations',
    label: 'REST API & Cloud',
    icon: 'api',
    pageId: 'integrations',
    children: [
      { pageId: 'integrations', label: 'Ringkasan Integrasi', icon: 'hub' },
      { pageId: 'api-sandbox', label: 'REST API Sandbox', icon: 'terminal' },
      { pageId: 'api-docs', label: 'Dokumentasi Terbuka', icon: 'menu_book' },
      { pageId: 'cloud-backup', label: 'Cadangan Cloud', icon: 'cloud_sync' }
    ]
  }
];

export const currentPage = signal<PageId>('dashboard');
export const pageParams = signal<Record<string, unknown>>({});

export function navigateTo(page: PageId, params: Record<string, unknown> = {}): void {
  pageParams.set(params);
  currentPage.set(page);
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
