import { computed } from '@angular/core';
import { talentProfilesState, updateDewanEtikReview } from '../../core/talent/talent.service';
import { membersState } from '../../shared/utils/storage';
import { DivisionCategory, MemberPersonalTalent } from '../../shared/models/personality-talent.model';
import { Member } from '../../shared/models/member.model';
import { detectTeamConflictsForDivision, TeamCharacterConflict } from './team-conflict-detector';

export type EthicalStatus = 'clear' | 'perlu_klarifikasi' | 'mitigasi_harmoni' | 'peringatan';

export interface MemberEthicalRecord {
  talent: MemberPersonalTalent;
  member?: Member;
  ethicalStatus: EthicalStatus;
  statusLabel: string;
  conflictFlags: string[];
  teamConflicts: TeamCharacterConflict[];
  integrityScore: number;
}

export const DIVISION_OPTIONS: { id: DivisionCategory; label: string }[] = [
  { id: 'ketua_umum', label: 'Ketua Presidium' },
  { id: 'keuangan_bendahara', label: 'Bendahara Kas' },
  { id: 'dewan_etik', label: 'Dewan Etik' },
  { id: 'humas_komunikasi', label: 'Humas & Mitra' },
  { id: 'acara_operasional', label: 'Operasional Acara' },
  { id: 'teknologi_media', label: 'IT & Media' },
  { id: 'sekretariat', label: 'Sekretariat' },
  { id: 'sosial_relawan', label: 'Sosial & Relawan' }
];

export function formatDivision(div: string): string {
  const match = DIVISION_OPTIONS.find(o => o.id === div);
  return match ? match.label : div.replace('_', ' ');
}

export const memberEthicalRecords = computed<MemberEthicalRecord[]>(() => {
  const talents = talentProfilesState();
  const members = membersState();

  return talents.map(tal => {
    const mem = members.find(m => m.id === tal.memberId);
    const conflicts: string[] = [];

    // Validasi Struktural AD/ART
    if (tal.recommendedDivision === 'keuangan_bendahara' && mem?.roleId === 'role-superadmin') {
      conflicts.push('Potensi benturan kewenangan: Super Admin merangkap Bendahara');
    }
    if (tal.weeklyHoursAvailable < 6 && (tal.recommendedDivision === 'ketua_umum' || tal.recommendedDivision === 'acara_operasional')) {
      conflicts.push('Komitmen jam per minggu rendah (< 6 jam) untuk peran kepengurusan dinamis');
    }
    if (mem?.status === 'nonaktif') {
      conflicts.push('Status keanggotaan nonaktif, perlu verifikasi ulang sebelum pelantikan');
    }

    // Validasi Friksi Karakter & Ketidakcocokan Tim (Weton, Shio Ciong, Elemen Api/Air)
    const teamConflicts = detectTeamConflictsForDivision(tal, tal.recommendedDivision, talents, members);
    for (const tc of teamConflicts) {
      conflicts.push(`[${tc.title}]: ${tc.description}`);
    }

    let ethicalStatus: EthicalStatus = 'clear';
    let statusLabel = 'Rekomendasi Bersih (Clear)';
    let score = tal.fitScore;

    if (conflicts.length > 0) {
      ethicalStatus = 'perlu_klarifikasi';
      statusLabel = teamConflicts.length > 0 ? 'Perlu Mitigasi Tim' : 'Perlu Klarifikasi Majelis';
      score = Math.max(50, score - (teamConflicts.length * 8 + 10));
    } else if (tal.fitScore < 80) {
      ethicalStatus = 'mitigasi_harmoni';
      statusLabel = 'Mitigasi Harmoni Duet';
    }

    return { talent: tal, member: mem, ethicalStatus, statusLabel, conflictFlags: conflicts, teamConflicts, integrityScore: score };
  });
});

export const divisionCountsMap = computed<Record<string, number>>(() => {
  const records = memberEthicalRecords();
  const counts: Record<string, number> = { all: records.length };
  for (const opt of DIVISION_OPTIONS) {
    counts[opt.id] = records.filter(r => r.talent.recommendedDivision === opt.id).length;
  }
  return counts;
});

export function saveDewanEtikVerdict(memberId: string, notes: string, division: DivisionCategory): void {
  const current = talentProfilesState().find(t => t.memberId === memberId);
  if (!current) return;
  updateDewanEtikReview(memberId, notes, division, current.fitScore);
}
