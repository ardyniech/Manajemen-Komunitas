import { signal } from '@angular/core';
import { MemberPersonalTalent, DivisionCategory, WorkStyle } from '../../shared/models/personality-talent.model';
import { INITIAL_TALENT_PROFILES } from '../initial-talent-data';
import { calculateJavaneseWeton } from '../../shared/utils/javanese-weton-calculator';
import { calculateAstrologyAndShio } from '../../shared/utils/astrology-shio-calculator';
import { dispatcher } from '../dispatcher';
import { awardPoints } from '../gamification/gamification.service';

const TALENT_STORAGE_KEY = 'komunika_member_talent_data';

function loadTalents(): MemberPersonalTalent[] {
  try {
    const raw = localStorage.getItem(TALENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_TALENT_PROFILES;
  } catch {
    return INITIAL_TALENT_PROFILES;
  }
}

function saveTalents(list: MemberPersonalTalent[]): void {
  try {
    localStorage.setItem(TALENT_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save talent profiles', err);
  }
}

export const talentProfilesState = signal<MemberPersonalTalent[]>(loadTalents());

export function computeDivisionMatch(wetonRole: string, workStyle: WorkStyle, preferred: DivisionCategory[]): { recommended: DivisionCategory; score: number } {
  if (preferred.length > 0 && preferred.includes('keuangan_bendahara') && (workStyle === 'analitis' || wetonRole.includes('Bendahara'))) {
    return { recommended: 'keuangan_bendahara', score: 96 };
  }
  if (preferred.includes('dewan_etik') && (workStyle === 'pelindung_nilai' || wetonRole.includes('Dewan Etik'))) {
    return { recommended: 'dewan_etik', score: 95 };
  }
  if (preferred.includes('humas_komunikasi') || workStyle === 'diplomat') {
    return { recommended: 'humas_komunikasi', score: 92 };
  }
  if (preferred.includes('ketua_umum') || workStyle === 'visioner') {
    return { recommended: 'ketua_umum', score: 94 };
  }
  if (preferred.includes('teknologi_media') || workStyle === 'analitis') {
    return { recommended: 'teknologi_media', score: 90 };
  }
  return { recommended: preferred[0] || 'acara_operasional', score: 88 };
}

export function saveMemberTalentProfile(memberId: string, data: Partial<MemberPersonalTalent>): MemberPersonalTalent {
  const current = talentProfilesState();
  const existing = current.find(t => t.memberId === memberId);
  const birthDate = data.birthDate || existing?.birthDate || '1995-01-01';
  const weton = calculateJavaneseWeton(birthDate);
  const astrology = calculateAstrologyAndShio(birthDate);
  const workStyle = data.workStyle || existing?.workStyle || 'visioner';
  const preferred = data.preferredDivisions || existing?.preferredDivisions || ['humas_komunikasi'];
  const match = computeDivisionMatch(weton.rekomendasiPeran, workStyle, preferred);

  const updated: MemberPersonalTalent = {
    memberId,
    birthDate,
    birthPlace: data.birthPlace || existing?.birthPlace || 'Indonesia',
    preferredDivisions: preferred,
    workStyle,
    topSkills: data.topSkills || existing?.topSkills || ['Komunikasi Organisasi'],
    weeklyHoursAvailable: data.weeklyHoursAvailable ?? existing?.weeklyHoursAvailable ?? 8,
    leadershipExperience: data.leadershipExperience || existing?.leadershipExperience || 'Anggota aktif komunitas',
    aspirations: data.aspirations || existing?.aspirations || 'Membangun komunitas lebih solid dan bermanfaat.',
    weton,
    astrology,
    dewanEtikNotes: data.dewanEtikNotes || existing?.dewanEtikNotes || 'Menunggu evaluasi Dewan Etik.',
    recommendedDivision: data.recommendedDivision || match.recommended,
    fitScore: data.fitScore || match.score,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  const nextList = existing ? current.map(t => t.memberId === memberId ? updated : t) : [...current, updated];
  talentProfilesState.set(nextList);
  saveTalents(nextList);
  awardPoints(memberId, 30, 'Lengkapi Data Personal & Karakter', 'profile_complete');
  dispatcher.emit('PROFILE_UPDATED', { memberId }, 'talent');
  return updated;
}

export function updateDewanEtikReview(memberId: string, notes: string, division: DivisionCategory, fitScore: number): void {
  talentProfilesState.update(list => list.map(item => item.memberId === memberId ? { ...item, dewanEtikNotes: notes, recommendedDivision: division, fitScore } : item));
  saveTalents(talentProfilesState());
}
