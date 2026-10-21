import { DivisionCategory, MemberPersonalTalent } from '../../shared/models/personality-talent.model';
import { talentProfilesState, updateDewanEtikReview } from '../../core/talent/talent.service';

export interface DivisionScoreBreakdown {
  division: DivisionCategory;
  wetonScore: number;
  astrologyScore: number;
  shioScore: number;
  compositeScore: number;
  rationale: string;
}

export interface SmartMatchResult {
  memberId: string;
  topDivision: DivisionCategory;
  secondaryDivision: DivisionCategory;
  topScore: number;
  wetonAlignment: number;
  astrologyAlignment: number;
  shioAlignment: number;
  breakdown: DivisionScoreBreakdown[];
  primaryReason: string;
}

const WETON_AFFINITY: Record<string, DivisionCategory> = {
  'Lakuning Srengenge': 'ketua_umum', 'Lakuning Lintang': 'ketua_umum',
  'Lakuning Mbulan': 'keuangan_bendahara', 'Pendito Sakti': 'dewan_etik',
  'Paripurna Luhur': 'dewan_etik', 'Lakuning Gunung': 'dewan_etik',
  'Lakuning Setan': 'dewan_etik', 'Lakuning Angin': 'humas_komunikasi',
  'Lakuning Geni': 'acara_operasional', 'Pendito Mbangun': 'teknologi_media',
  'Lakuning Kembang': 'sosial_relawan', 'Lakuning Bumi': 'sosial_relawan'
};

const ELEM_AFFINITY: Record<string, DivisionCategory[]> = {
  Api: ['ketua_umum', 'acara_operasional'],
  Tanah: ['keuangan_bendahara', 'sekretariat'],
  Udara: ['humas_komunikasi', 'teknologi_media'],
  Air: ['dewan_etik', 'sosial_relawan']
};

const SHIO_AFFINITY: Record<string, DivisionCategory[]> = {
  Naga: ['ketua_umum'], Macan: ['ketua_umum', 'acara_operasional'], Kuda: ['acara_operasional'],
  Kerbau: ['keuangan_bendahara', 'dewan_etik'], Ayam: ['keuangan_bendahara', 'sekretariat'], Anjing: ['dewan_etik'],
  Kelinci: ['humas_komunikasi'], Kambing: ['sosial_relawan'], Babi: ['sosial_relawan', 'humas_komunikasi'],
  Tikus: ['teknologi_media', 'keuangan_bendahara'], Monyet: ['teknologi_media', 'humas_komunikasi'], Ular: ['dewan_etik', 'sekretariat']
};

const ALL_DIVS: DivisionCategory[] = [
  'ketua_umum', 'keuangan_bendahara', 'dewan_etik', 'humas_komunikasi',
  'acara_operasional', 'teknologi_media', 'sekretariat', 'sosial_relawan'
];

export function calculateSmartMatch(talent: MemberPersonalTalent): SmartMatchResult {
  const weton = talent.weton;
  const astro = talent.astrology;
  const preferredWetonDiv = WETON_AFFINITY[weton.watakUtama] || 'humas_komunikasi';
  const preferredAstroDivs = ELEM_AFFINITY[astro.element] || ['humas_komunikasi'];
  const preferredShioDivs = SHIO_AFFINITY[astro.shio] || ['sosial_relawan'];

  const scores: DivisionScoreBreakdown[] = ALL_DIVS.map(div => {
    let wScore = 70;
    if (preferredWetonDiv === div) wScore = 98;
    else if ((weton.neptu >= 14 && (div === 'ketua_umum' || div === 'dewan_etik')) || (weton.neptu <= 10 && div === 'acara_operasional')) wScore = 90;

    let aScore = 68;
    if (preferredAstroDivs.includes(div)) aScore = 96;
    else if (astro.element === 'Tanah' && div === 'keuangan_bendahara') aScore = 98;
    else if (astro.element === 'Udara' && div === 'humas_komunikasi') aScore = 96;

    let sScore = 70;
    if (preferredShioDivs.includes(div)) sScore = 95;
    else if (['Kerbau', 'Ayam', 'Anjing'].includes(astro.shio) && (div === 'dewan_etik' || div === 'keuangan_bendahara')) sScore = 92;

    const comp = Math.round((wScore * 0.35) + (aScore * 0.35) + (sScore * 0.30));
    return {
      division: div, wetonScore: wScore, astrologyScore: aScore, shioScore: sScore,
      compositeScore: comp,
      rationale: `Harmoni weton ${weton.wetonFull} (${wScore}%), elemen ${astro.element} (${aScore}%), dan shio ${astro.shio} (${sScore}%).`
    };
  });

  scores.sort((a, b) => b.compositeScore - a.compositeScore);
  const top = scores[0];
  const second = scores[1] || scores[0];

  return {
    memberId: talent.memberId,
    topDivision: top.division,
    secondaryDivision: second.division,
    topScore: top.compositeScore,
    wetonAlignment: top.wetonScore,
    astrologyAlignment: top.astrologyScore,
    shioAlignment: top.shioScore,
    breakdown: scores,
    primaryReason: `Weton ${weton.wetonFull} (${weton.watakUtama}), Zodiak ${astro.zodiacSign} (${astro.element}), Shio ${astro.shio} ${astro.shioElement}`
  };
}

export function applySmartMatchToCandidate(talent: MemberPersonalTalent, chosenDiv: DivisionCategory, score: number): void {
  const result = calculateSmartMatch(talent);
  const note = `[Smart Matching Dewan Etik]: Direkomendasikan ke formasi ${chosenDiv.replace('_', ' ')} berdasarkan asesmen Weton (${result.wetonAlignment}%), Astrologi (${result.astrologyAlignment}%), dan Shio (${result.shioAlignment}%).`;
  updateDewanEtikReview(talent.memberId, note, chosenDiv, score);
}

export function batchApplyAllSmartMatches(): number {
  const list = talentProfilesState();
  let updatedCount = 0;
  for (const t of list) {
    const res = calculateSmartMatch(t);
    applySmartMatchToCandidate(t, res.topDivision, res.topScore);
    updatedCount++;
  }
  return updatedCount;
}
