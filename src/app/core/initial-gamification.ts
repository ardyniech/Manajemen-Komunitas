import { MemberGamification } from '../shared/models/gamification.model';

export const INITIAL_GAMIFICATION_USER: MemberGamification = {
  memberId: 'mem-1',
  totalPoints: 485,
  currentLevel: 3,
  levelName: 'Silver Member',
  rankTitle: 'Kontributor Aktif',
  history: [
    {
      id: 'act-1',
      memberId: 'mem-1',
      actionType: 'dues_paid',
      points: 50,
      title: 'Pembayaran Iuran Kas Q3',
      description: 'Pembayaran iuran kas tepat waktu via QRIS',
      createdAt: '2026-09-28 10:15 WIB'
    },
    {
      id: 'act-2',
      memberId: 'mem-1',
      actionType: 'event_rsvp',
      points: 25,
      title: 'Hadir Rapat Pleno Tahunan',
      description: 'Konfirmasi RSVP dan hadir tepat waktu',
      createdAt: '2026-09-20 14:00 WIB'
    },
    {
      id: 'act-3',
      memberId: 'mem-1',
      actionType: 'forum_post',
      points: 15,
      title: 'Topik Inisiatif Program Hijau',
      description: 'Memulai diskusi inisiatif sosial komunitas',
      createdAt: '2026-09-15 09:30 WIB'
    },
    {
      id: 'act-4',
      memberId: 'mem-1',
      actionType: 'referral',
      points: 100,
      title: 'Undang Rekan Komunitas (Siti Nurhaliza)',
      description: 'Rekan berhasil mendaftar menggunakan referral Anda',
      createdAt: '2026-09-02 11:20 WIB'
    }
  ],
  forumPostsCount: 4,
  duesPaidCount: 3,
  referralsCount: 2,
  eventsAttendedCount: 3
};
