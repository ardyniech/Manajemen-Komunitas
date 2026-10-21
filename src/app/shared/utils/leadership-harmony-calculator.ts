import { MemberPersonalTalent } from '../models/personality-talent.model';

export interface HarmonyAnalysis {
  compatibilityScore: number; // 0 - 100%
  synergyLevel: 'Sangat Harmonis' | 'Harmonis & Produktif' | 'Dinamis & Saling Mengisi' | 'Perlu Penyelarasan';
  wetonNeptuCombined: number;
  javanesePetungCategory: string;
  elementalDynamic: string;
  collaborationStrengths: string[];
  potentialFrictions: string[];
  dewanEtikRecommendation: string;
}

const PETUNG_RULES: Record<number, { title: string; desc: string }> = {
  1: { title: 'Wasesa Segara', desc: 'Sangat disegani, berwawasan luas, pembawa kelancaran rezeki kas dan kemakmuran komunitas.' },
  2: { title: 'Tunggak Semi', desc: 'Rezeki dan program kerja terus tumbuh berkesinambungan tanpa henti.' },
  3: { title: 'Satria Wibawa', desc: 'Memancarkan kehormatan, wibawa tinggi, dan dipercaya penuh oleh seluruh anggota.' },
  4: { title: 'Sumur Sinaba', desc: 'Menjadi sumber inspirasi, rujukan ilmu, dan panutan musyawarah mufakat.' },
  5: { title: 'Bumi Kapetak', desc: 'Pekerja keras, tahan banting menghadapi dinamika krisis, namun membutuhkan komunikasi terbuka.' },
  6: { title: 'Satria Wirang', desc: 'Penuh dinamika ide; sangat inovatif jika ada fasilitator penengah yang adil.' },
  7: { title: 'Lebu Katiup Angin', desc: 'Sangat adaptif dan lincah bermanuver, perlu standard operating procedure yang jelas.' },
  0: { title: 'Paripurna Agung', desc: 'Kombinasi langka yang saling melengkapi dalam kepemimpinan dan manajerial.' }
};

export function calculateLeadershipHarmony(leaderA: MemberPersonalTalent, leaderB: MemberPersonalTalent): HarmonyAnalysis {
  const combinedNeptu = leaderA.weton.neptu + leaderB.weton.neptu;
  const petungRemainder = combinedNeptu % 7;
  const petung = PETUNG_RULES[petungRemainder] || PETUNG_RULES[1];

  const elemA = leaderA.astrology.element;
  const elemB = leaderB.astrology.element;

  let elemScore = 80;
  let elemText = 'Elemen berimbang';

  if ((elemA === 'Api' && elemB === 'Udara') || (elemA === 'Udara' && elemB === 'Api')) {
    elemScore = 95;
    elemText = 'Sinergi Api & Udara: Ide visioner langsung berkobar menjadi aksi nyata.';
  } else if ((elemA === 'Tanah' && elemB === 'Air') || (elemA === 'Air' && elemB === 'Tanah')) {
    elemScore = 94;
    elemText = 'Sinergi Tanah & Air: Menghasilkan stabilitas manajerial dan suasana kekeluargaan yang sejuk.';
  } else if (elemA === elemB) {
    elemScore = 88;
    elemText = `Sinergi Sama (${elemA}): Memiliki frekuensi pemikiran dan ritme kerja yang serupa.`;
  } else {
    elemScore = 82;
    elemText = 'Sinergi Komplementer: Menghadirkan perspektif berbeda yang memperkaya sudut pandang kepengurusan.';
  }

  const baseScore = Math.min(99, Math.round(elemScore * 0.5 + (combinedNeptu % 2 === 0 ? 46 : 42)));

  let synergy: HarmonyAnalysis['synergyLevel'] = 'Harmonis & Produktif';
  if (baseScore >= 92) synergy = 'Sangat Harmonis';
  else if (baseScore >= 85) synergy = 'Harmonis & Produktif';
  else if (baseScore >= 75) synergy = 'Dinamis & Saling Mengisi';
  else synergy = 'Perlu Penyelarasan';

  return {
    compatibilityScore: baseScore,
    synergyLevel: synergy,
    wetonNeptuCombined: combinedNeptu,
    javanesePetungCategory: petung.title,
    elementalDynamic: elemText,
    collaborationStrengths: [
      `Kombinasi watak ${leaderA.weton.watakUtama} dan ${leaderB.weton.watakUtama}.`,
      petung.desc,
      `Gaya kerja ${leaderA.workStyle} bersinergi dengan ${leaderB.workStyle}.`
    ],
    potentialFrictions: [
      combinedNeptu > 28 ? 'Keduanya berkepribadian kuat; pastikan pembagian wewenang tercantum tertulis di AD/ART.' : 'Perlu koordinasi rapat evaluasi minimal 2 pekan sekali.'
    ],
    dewanEtikRecommendation: baseScore >= 85 
      ? 'Dewan Etik merekomendasikan duet kepengurusan ini untuk disahkan dalam Surat Keputusan.'
      : 'Duet dapat berjalan efektif dengan menunjuk koordinator penghubung yang berwatak penengah.'
  };
}
