import { CommunityEvent } from '../shared/models/calendar.model';

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'Gathering Komunitas & Silaturahmi Akbar 2026',
    description: 'Pertemuan akbar tahunan seluruh anggota komunitas Komunika OS untuk mempererat tali silaturahmi, ramah tamah, dan diskusi program kerja mendatang.',
    category: 'gathering',
    startDate: '2026-10-15',
    startTime: '09:00',
    endDate: '2026-10-15',
    endTime: '13:00',
    isOnline: false,
    location: 'Auditorium Komunika Hub, Jl. Asia Afrika No. 88, Bandung',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
    maxCapacity: 100,
    organizerId: 'mem-1',
    organizerName: 'Budi Santoso',
    organizerRole: 'Ketua Umum',
    createdAt: '2026-09-20',
    reminderMinutesBefore: 1440,
    attendees: [
      { memberId: 'mem-1', memberName: 'Budi Santoso', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'going', rsvpAt: '2026-09-21 10:00' },
      { memberId: 'mem-2', memberName: 'Siti Rahmawati', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', status: 'going', rsvpAt: '2026-09-21 10:30' },
      { memberId: 'mem-3', memberName: 'Ahmad Fauzi', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'maybe', rsvpAt: '2026-09-22 14:00' }
    ]
  },
  {
    id: 'evt-2',
    title: 'Workshop: Manajemen Kas Komunitas & Transparansi QRIS',
    description: 'Pelatihan teknis pengelolaan laporan keuangan kas digital, integrasi gateway QRIS, serta praktik rekonsiliasi kas berbasis cloud.',
    category: 'workshop',
    startDate: '2026-10-22',
    startTime: '19:30',
    endDate: '2026-10-22',
    endTime: '21:30',
    isOnline: true,
    location: 'Google Meet Virtual Stage',
    onlineMeetingUrl: 'https://meet.google.com/kom-unika-meet',
    coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
    maxCapacity: 150,
    organizerId: 'mem-2',
    organizerName: 'Siti Rahmawati',
    organizerRole: 'Bendahara Umum',
    createdAt: '2026-09-22',
    reminderMinutesBefore: 60,
    attendees: [
      { memberId: 'mem-1', memberName: 'Budi Santoso', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'going', rsvpAt: '2026-09-23 09:00' },
      { memberId: 'mem-4', memberName: 'Dewi Lestari', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', status: 'going', rsvpAt: '2026-09-23 11:20' }
    ]
  },
  {
    id: 'evt-3',
    title: 'Rapat Pleno Pengurus Evaluasi Kuartal III',
    description: 'Rapat koordinasi khusus pengurus dan koordinator divisi untuk mereview capaian kuartal ke-3 dan merumuskan program kerja kuartal ke-4.',
    category: 'rapat',
    startDate: '2026-10-28',
    startTime: '14:00',
    endDate: '2026-10-28',
    endTime: '17:00',
    isOnline: false,
    location: 'Ruang Rapat VIP Lt. 2, Sekretariat Komunika',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    maxCapacity: 30,
    organizerId: 'mem-1',
    organizerName: 'Budi Santoso',
    organizerRole: 'Ketua Umum',
    createdAt: '2026-09-24',
    reminderMinutesBefore: 120,
    attendees: [
      { memberId: 'mem-1', memberName: 'Budi Santoso', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'going', rsvpAt: '2026-09-24 16:00' },
      { memberId: 'mem-2', memberName: 'Siti Rahmawati', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', status: 'going', rsvpAt: '2026-09-24 16:05' }
    ]
  },
  {
    id: 'evt-4',
    title: 'Aksi Peduli Sosial: Donasi & Santunan Komunitas',
    description: 'Kegiatan bakti sosial pembagian sembako dan donasi buku untuk yayasan yatim piatu di sekitar lingkungan sekretariat komunitas.',
    category: 'sosial',
    startDate: '2026-11-08',
    startTime: '08:00',
    endDate: '2026-11-08',
    endTime: '12:00',
    isOnline: false,
    location: 'Panti Asuhan Kasih Bangsa, Jl. Cihampelas No. 45',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80',
    maxCapacity: 50,
    organizerId: 'mem-3',
    organizerName: 'Ahmad Fauzi',
    organizerRole: 'Divisi Sosial & Relawan',
    createdAt: '2026-09-25',
    reminderMinutesBefore: 1440,
    attendees: [
      { memberId: 'mem-1', memberName: 'Budi Santoso', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'going', rsvpAt: '2026-09-25 18:00' }
    ]
  }
];
