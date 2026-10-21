import { signal } from '@angular/core';
import { Language } from '../shared/models/common.model';

export const DICTIONARY: Record<Language, Record<string, string>> = {
  id: {
    app_title: 'Manajemen Komunitas',
    nav_dashboard: 'Ringkasan',
    nav_members: 'Anggota',
    nav_finance: 'Kas & Iuran',
    nav_forum: 'Forum Diskusi',
    nav_analytics: 'Analitik',
    nav_roles: 'Kelola Hak Akses',
    nav_settings: 'Profil Komunitas',
    nav_security: 'Keamanan & 2FA',
    nav_integrations: 'Integrasi & Backup',
    total_members: 'Total Anggota',
    active_members: 'Anggota Aktif',
    total_cash: 'Saldo Kas Komunitas',
    dues_collection_rate: 'Kepatuhan Iuran',
    recent_transactions: 'Transaksi Kas Terkini',
    recent_discussions: 'Diskusi Terbaru',
    add_member: 'Tambah Anggota',
    record_dues: 'Catat Iuran',
    record_expense: 'Catat Pengeluaran',
    export_data: 'Ekspor Laporan',
    import_data: 'Impor Data CSV',
    search_placeholder: 'Cari data...',
    status_active: 'Aktif',
    status_pending: 'Menunggu',
    status_inactive: 'Nonaktif',
    status_paid: 'Lunas',
    download_pdf: 'Unduh PDF',
    download_excel: 'Unduh Excel/CSV',
    cloud_backup_now: 'Cadangkan ke Cloud Sekarang',
    two_factor_auth: 'Otentikasi Dua Faktor (2FA)',
    e2ee_status: 'Enkripsi End-to-End (E2EE)',
    install_pwa: 'Pasang Aplikasi PWA',
    role_super_admin: 'Super Admin',
    role_ketua: 'Ketua Komunitas',
    role_bendahara: 'Bendahara Kas',
    role_moderator: 'Pengurus / Moderator',
    role_anggota: 'Anggota Umum',
    backup_cloud_title: 'Pencadangan Cloud Otomatis & Keamanan Data',
    backup_cloud_desc: 'Konfigurasi jadwal backup harian, pilih layanan cloud, dan enkripsi end-to-end.'
  },
  en: {
    app_title: 'Community Manager',
    nav_dashboard: 'Dashboard',
    nav_members: 'Members',
    nav_finance: 'Treasury & Dues',
    nav_forum: 'Internal Forum',
    nav_analytics: 'Analytics',
    nav_roles: 'Role Permissions',
    nav_settings: 'Community Profile',
    nav_security: 'Security & 2FA',
    nav_integrations: 'Integrations & Backup',
    total_members: 'Total Members',
    active_members: 'Active Members',
    total_cash: 'Treasury Balance',
    dues_collection_rate: 'Dues Collection Rate',
    recent_transactions: 'Recent Transactions',
    recent_discussions: 'Latest Discussions',
    add_member: 'Add Member',
    record_dues: 'Record Dues',
    record_expense: 'Record Expense',
    export_data: 'Export Report',
    import_data: 'Import CSV Data',
    search_placeholder: 'Search records...',
    status_active: 'Active',
    status_pending: 'Pending',
    status_inactive: 'Inactive',
    status_paid: 'Paid',
    download_pdf: 'Download PDF',
    download_excel: 'Download Excel/CSV',
    cloud_backup_now: 'Backup to Cloud Now',
    two_factor_auth: 'Two-Factor Authentication (2FA)',
    e2ee_status: 'End-to-End Encryption (E2EE)',
    install_pwa: 'Install PWA App',
    role_super_admin: 'Super Admin',
    role_ketua: 'Community Head',
    role_bendahara: 'Treasurer',
    role_moderator: 'Moderator',
    role_anggota: 'General Member',
    backup_cloud_title: 'Automated Cloud Backup & Data Security',
    backup_cloud_desc: 'Configure daily backup schedules, select cloud storage providers, and end-to-end encryption.'
  }
};

export const currentLanguage = signal<Language>('id');

export function setAppLanguage(lang: Language): void {
  currentLanguage.set(lang);
}

export function t(key: string): string {
  const lang = currentLanguage();
  return DICTIONARY[lang][key] ?? DICTIONARY['id'][key] ?? key;
}
