import { MemberPersonalTalent, DivisionCategory } from '../../shared/models/personality-talent.model';
import { Member } from '../../shared/models/member.model';

export type ConflictSeverity = 'tinggi' | 'sedang' | 'mitigasi';

export interface TeamCharacterConflict {
  type: 'element_clash' | 'command_clash' | 'shio_ciong' | 'weton_padu';
  title: string;
  description: string;
  severity: ConflictSeverity;
  colleagueId: string;
  colleagueName: string;
  mitigationAdvice: string;
  suggestedMediator?: string;
}

const CIONG_MAP: Record<string, string> = {
  Tikus: 'Kuda', Kuda: 'Tikus',
  Kerbau: 'Kambing', Kambing: 'Kerbau',
  Macan: 'Monyet', Monyet: 'Macan',
  Kelinci: 'Ayam', Ayam: 'Kelinci',
  Naga: 'Anjing', Anjing: 'Naga',
  Ular: 'Babi', Babi: 'Ular'
};

export function detectTeamConflictsForDivision(
  targetTalent: MemberPersonalTalent,
  targetDivision: DivisionCategory,
  allTalents: MemberPersonalTalent[],
  allMembers: Member[]
): TeamCharacterConflict[] {
  const conflicts: TeamCharacterConflict[] = [];
  const teamMembers = allTalents.filter(
    t => t.memberId !== targetTalent.memberId && t.recommendedDivision === targetDivision
  );

  const mediatorTalent = allTalents.find(t =>
    t.memberId !== targetTalent.memberId &&
    (t.astrology.element === 'Tanah' || t.astrology.element === 'Udara') &&
    t.fitScore >= 80
  );
  const mediatorMem = mediatorTalent ? allMembers.find(m => m.id === mediatorTalent.memberId) : null;
  const suggestedMediator = mediatorMem ? `${mediatorMem.fullName} (${mediatorTalent?.astrology.element})` : undefined;

  for (const colleague of teamMembers) {
    const mem = allMembers.find(m => m.id === colleague.memberId);
    const colleagueName = mem?.fullName || `Anggota #${colleague.memberId}`;

    // 1. Shio Ciong Conflict (Polaritas Bertolak Belakang)
    const ciongOpposite = CIONG_MAP[targetTalent.astrology.shio];
    if (ciongOpposite && ciongOpposite === colleague.astrology.shio) {
      conflicts.push({
        type: 'shio_ciong',
        title: `Inkompatibilitas Shio (${targetTalent.astrology.shio} vs ${colleague.astrology.shio})`,
        description: `Polaritas shio berlawanan antara ${targetTalent.astrology.shio} dan ${colleague.astrology.shio} berpotensi memicu resistensi komunikasi.`,
        severity: 'tinggi',
        colleagueId: colleague.memberId,
        colleagueName,
        mitigationAdvice: 'Gunakan alur komunikasi tertulis dan tetapkan batas tanggung jawab yang tidak tumpang tindih.',
        suggestedMediator
      });
    }

    // 2. Element Friction: Api vs Air
    const elemA = targetTalent.astrology.element;
    const elemB = colleague.astrology.element;
    if ((elemA === 'Api' && elemB === 'Air') || (elemA === 'Air' && elemB === 'Api')) {
      conflicts.push({
        type: 'element_clash',
        title: 'Friksi Polarisasi Elemen (Api vs Air)',
        description: `Gaya kerja bertekanan tinggi (Api) rentan bergesekan dengan pendekatan sensitif (Air).`,
        severity: 'sedang',
        colleagueId: colleague.memberId,
        colleagueName,
        mitigationAdvice: 'Tunjuk anggota bervisi Udara atau Tanah sebagai jembatan penyejuk dinamika tim.',
        suggestedMediator
      });
    }

    // 3. Dominant Command Clash: Api + Api with Visioner Workstyle
    if (elemA === 'Api' && elemB === 'Api' && targetTalent.workStyle === 'visioner' && colleague.workStyle === 'visioner') {
      conflicts.push({
        type: 'command_clash',
        title: 'Friksi Dominasi Kepemimpinan (Dual Visioner Api)',
        description: `Dua figur bertemperamen Api dan sama-sama Visioner dalam satu divisi berisiko memicu perebutan komando.`,
        severity: 'tinggi',
        colleagueId: colleague.memberId,
        colleagueName,
        mitigationAdvice: 'Pastikan salah satu berperan sebagai konseptor dan yang lain sebagai eksekutor utama.',
        suggestedMediator
      });
    }

    // 4. Petung Neptu Weton Disharmony (Kategori Padu)
    const totalNeptu = targetTalent.weton.neptu + colleague.weton.neptu;
    if (totalNeptu % 7 === 6 || totalNeptu % 8 === 6) {
      conflicts.push({
        type: 'weton_padu',
        title: `Disharmoni Weton Neptu ${totalNeptu} (Kategori Padu)`,
        description: `Duet weton ${targetTalent.weton.wetonFull} & ${colleague.weton.wetonFull} berkecenderungan adu argumen sengit.`,
        severity: 'sedang',
        colleagueId: colleague.memberId,
        colleagueName,
        mitigationAdvice: 'Wajibkan sesi mediasi Dewan Etik berkala sebelum pengesahan program kerja.',
        suggestedMediator
      });
    }
  }

  return conflicts;
}
