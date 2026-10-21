import { FinanceTransaction } from '../shared/models/finance.model';
import { ForumTopic } from '../shared/models/forum.model';

export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'tx-001',
    transactionNumber: 'TRX-2026-0901',
    date: '2026-09-15',
    type: 'iuran',
    category: 'Iuran Bulanan Anggota',
    title: 'Pembayaran Iuran Q3 2026 - Arya Pratama',
    amount: 150000,
    memberId: 'mem-001',
    memberName: 'Arya Pratama',
    status: 'lunas',
    method: 'qris',
    notes: 'Paket Iuran 3 Bulan (Juli - September)'
  },
  {
    id: 'tx-002',
    transactionNumber: 'TRX-2026-0902',
    date: '2026-09-14',
    type: 'iuran',
    category: 'Iuran Bulanan Anggota',
    title: 'Pembayaran Iuran September - Siti Rahmawati',
    amount: 50000,
    memberId: 'mem-002',
    memberName: 'Siti Rahmawati',
    status: 'lunas',
    method: 'transfer_bank',
    notes: 'Transfer via BCA Mobile'
  },
  {
    id: 'tx-003',
    transactionNumber: 'TRX-2026-0903',
    date: '2026-09-12',
    type: 'pemasukan_lain',
    category: 'Sponsorship & Donasi',
    title: 'Sponsorship Workshop AI & Cloud Tech',
    amount: 3500000,
    status: 'lunas',
    method: 'transfer_bank',
    notes: 'Dukungan kemitraan dari TechVentures ID'
  },
  {
    id: 'tx-004',
    transactionNumber: 'TRX-2026-0904',
    date: '2026-09-10',
    type: 'pengeluaran',
    category: 'Operasional & Server',
    title: 'Sewa Server Cloud & Domain Tahunan',
    amount: 850000,
    status: 'lunas',
    method: 'virtual_account',
    notes: 'Perpanjangan domain & hosting komunitas'
  },
  {
    id: 'tx-005',
    transactionNumber: 'TRX-2026-0905',
    date: '2026-09-08',
    type: 'pengeluaran',
    category: 'Kegiatan & Konsumsi',
    title: 'Konsumsi Temu Darat Meetup Bulanan',
    amount: 620000,
    status: 'lunas',
    method: 'qris',
    notes: 'Snack dan kopi 35 peserta di Co-Working Space'
  }
];

export const INITIAL_TOPICS: ForumTopic[] = [
  {
    id: 'top-001',
    category: 'Pengumuman',
    title: 'Agenda Rapat Kerja Tahunan Komunitas 2026 & Pemilihan Pengurus Baru',
    content: 'Rekan-rekan pengurus dan anggota, rapat kerja tahunan akan dilaksanakan pada Sabtu pekan depan via Hybrid (Gedung Kolaborasi & Google Meet). Mohon mengisi konfirmasi kehadiran.',
    authorId: 'mem-003',
    authorName: 'Dimas Setiawan',
    authorRole: 'Ketua Komunitas',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-09-16T10:00:00Z',
    isPinned: true,
    viewsCount: 342,
    likesCount: 28,
    tags: ['Raker2026', 'PengumumanResmi', 'HybridMeetup'],
    comments: [
      {
        id: 'com-001',
        topicId: 'top-001',
        authorId: 'mem-001',
        authorName: 'Arya Pratama',
        authorRole: 'Super Administrator',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Siap hadir! Bahan paparan laporan teknologi sudah siap kami presentasikan.',
        createdAt: '2026-09-16T11:20:00Z',
        likesCount: 5
      }
    ]
  },
  {
    id: 'top-002',
    category: 'Ide & Inovasi',
    title: 'Inisiasi Mini Bootcamp Open-Source untuk Anggota Baru',
    content: 'Bagaimana bila kita bikin mentorship mingguan mentoring Git, TypeScript, dan Cloud Deployment? Ini bisa memicu anggota baru lebih aktif berkarya.',
    authorId: 'mem-004',
    authorName: 'Anisa Larasati',
    authorRole: 'Pengurus / Moderator',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-09-14T09:15:00Z',
    isPinned: false,
    viewsCount: 189,
    likesCount: 34,
    tags: ['Edukasi', 'Bootcamp', 'OpenSource'],
    comments: []
  }
];
