import { MemberPersonalTalent } from '../shared/models/personality-talent.model';
import { calculateJavaneseWeton } from '../shared/utils/javanese-weton-calculator';
import { calculateAstrologyAndShio } from '../shared/utils/astrology-shio-calculator';

export const INITIAL_TALENT_PROFILES: MemberPersonalTalent[] = [
  {
    memberId: 'mem-1',
    birthDate: '1988-08-17',
    birthPlace: 'Yogyakarta',
    preferredDivisions: ['ketua_umum', 'dewan_etik'],
    workStyle: 'visioner',
    topSkills: ['Kepemimpinan', 'Resolusi Konflik', 'Manajemen Strategis'],
    weeklyHoursAvailable: 15,
    leadershipExperience: 'Pernah menjabat Ketua Organisasi Mahasiswa & Koordinator Wilayah',
    aspirations: 'Membangun komunitas mandiri secara finansial dan harmonis berlandaskan asas musyawarah.',
    weton: calculateJavaneseWeton('1988-08-17'),
    astrology: calculateAstrologyAndShio('1988-08-17'),
    dewanEtikNotes: 'Karakter sangat kuat, bijaksana, memiliki integritas moral tinggi dan disegani anggota.',
    recommendedDivision: 'ketua_umum',
    fitScore: 98,
    updatedAt: '2026-09-20'
  },
  {
    memberId: 'mem-2',
    birthDate: '1992-04-12',
    birthPlace: 'Surabaya',
    preferredDivisions: ['keuangan_bendahara', 'sekretariat'],
    workStyle: 'analitis',
    topSkills: ['Akuntansi Kas', 'Rekonsiliasi Bank', 'Audit Internal'],
    weeklyHoursAvailable: 12,
    leadershipExperience: 'Bendahara Paguyuban Alumni selama 3 tahun',
    aspirations: 'Mewujudkan pembukuan kas 100% transparan real-time berbasis QRIS.',
    weton: calculateJavaneseWeton('1992-04-12'),
    astrology: calculateAstrologyAndShio('1992-04-12'),
    dewanEtikNotes: 'Sangat jujur, teliti, rapi dalam administrasi, terbukti tidak pernah ada selisih kas.',
    recommendedDivision: 'keuangan_bendahara',
    fitScore: 95,
    updatedAt: '2026-09-22'
  },
  {
    memberId: 'mem-3',
    birthDate: '1995-11-28',
    birthPlace: 'Bandung',
    preferredDivisions: ['humas_komunikasi', 'acara_operasional'],
    workStyle: 'diplomat',
    topSkills: ['Public Speaking', 'Jejaring Media', 'Manajemen Event'],
    weeklyHoursAvailable: 10,
    leadershipExperience: 'Koordinator Acara Festival Budaya Tahunan',
    aspirations: 'Menjalin kolaborasi lintas komunitas dan memperluas relasi eksternal.',
    weton: calculateJavaneseWeton('1995-11-28'),
    astrology: calculateAstrologyAndShio('1995-11-28'),
    dewanEtikNotes: 'Komunikatif, luwes, cepat mencairkan suasana saat ada perbedaan pendapat.',
    recommendedDivision: 'humas_komunikasi',
    fitScore: 92,
    updatedAt: '2026-09-23'
  },
  {
    memberId: 'mem-4',
    birthDate: '1990-07-05',
    birthPlace: 'Semarang',
    preferredDivisions: ['dewan_etik', 'sosial_relawan'],
    workStyle: 'pelindung_nilai',
    topSkills: ['Hukum Organisasi', 'Mediasi', 'Advokasi Warga'],
    weeklyHoursAvailable: 8,
    leadershipExperience: 'Tim Etik & Disiplin Organisasi Profesi',
    aspirations: 'Menjaga marwah organisasi agar senantiasa taat anggaran dasar dan etika.',
    weton: calculateJavaneseWeton('1990-07-05'),
    astrology: calculateAstrologyAndShio('1990-07-05'),
    dewanEtikNotes: 'Tegas, objektif, tidak pandang bulu dalam menegakkan aturan demi keadilan bersama.',
    recommendedDivision: 'dewan_etik',
    fitScore: 96,
    updatedAt: '2026-09-24'
  }
];
