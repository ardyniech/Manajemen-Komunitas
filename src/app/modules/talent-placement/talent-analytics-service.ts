import { computed } from '@angular/core';
import { talentProfilesState } from '../../core/talent/talent.service';
import { DivisionCategory } from '../../shared/models/personality-talent.model';

export interface TalentAnalyticsSummary {
  totalProfiles: number;
  averageFitScore: number;
  highReadinessCount: number; // fitScore >= 90
  dominantElement: string;
  zodiacElementBreakdown: { element: string; count: number; percentage: number; colorClass: string }[];
  divisionDistribution: { division: DivisionCategory; label: string; count: number; avgScore: number }[];
  workStyleBreakdown: { style: string; count: number }[];
}

export const talentAnalyticsSummary = computed<TalentAnalyticsSummary>(() => {
  const list = talentProfilesState();
  const total = list.length || 1;

  let totalScore = 0;
  let highReadiness = 0;
  const elemCounts: Record<string, number> = { Api: 0, Tanah: 0, Udara: 0, Air: 0 };
  const divStats: Record<string, { count: number; totalScore: number }> = {
    ketua_umum: { count: 0, totalScore: 0 },
    keuangan_bendahara: { count: 0, totalScore: 0 },
    dewan_etik: { count: 0, totalScore: 0 },
    humas_komunikasi: { count: 0, totalScore: 0 },
    acara_operasional: { count: 0, totalScore: 0 },
    teknologi_media: { count: 0, totalScore: 0 }
  };
  const styleCounts: Record<string, number> = {};

  for (const t of list) {
    totalScore += t.fitScore;
    if (t.fitScore >= 90) highReadiness++;

    const elem = t.astrology.element || 'Api';
    elemCounts[elem] = (elemCounts[elem] || 0) + 1;

    const div = t.recommendedDivision || 'humas_komunikasi';
    if (!divStats[div]) divStats[div] = { count: 0, totalScore: 0 };
    divStats[div].count++;
    divStats[div].totalScore += t.fitScore;

    const style = t.workStyle || 'visioner';
    styleCounts[style] = (styleCounts[style] || 0) + 1;
  }

  const elements = [
    { element: 'Api (Semangat & Aksi)', count: elemCounts['Api'] || 0, percentage: Math.round(((elemCounts['Api'] || 0) / total) * 100), colorClass: 'bg-rose-500' },
    { element: 'Tanah (Stabilitas & Rapi)', count: elemCounts['Tanah'] || 0, percentage: Math.round(((elemCounts['Tanah'] || 0) / total) * 100), colorClass: 'bg-amber-600' },
    { element: 'Udara (Inovasi & Komunikasi)', count: elemCounts['Udara'] || 0, percentage: Math.round(((elemCounts['Udara'] || 0) / total) * 100), colorClass: 'bg-sky-500' },
    { element: 'Air (Empathy & Pengayom)', count: elemCounts['Air'] || 0, percentage: Math.round(((elemCounts['Air'] || 0) / total) * 100), colorClass: 'bg-indigo-500' }
  ];

  let topElem = 'Api';
  let maxCount = -1;
  for (const e of elements) {
    if (e.count > maxCount) {
      maxCount = e.count;
      topElem = e.element.split(' ')[0];
    }
  }

  const divLabels: Record<string, string> = {
    ketua_umum: 'Ketua / Presidium',
    keuangan_bendahara: 'Bendahara Kas',
    dewan_etik: 'Dewan Etik',
    humas_komunikasi: 'Humas & Kemitraan',
    acara_operasional: 'Operasional Acara',
    teknologi_media: 'IT & Media'
  };

  const divisions = Object.keys(divStats).map(key => {
    const st = divStats[key];
    return {
      division: key as DivisionCategory,
      label: divLabels[key] || key,
      count: st.count,
      avgScore: st.count > 0 ? Math.round(st.totalScore / st.count) : 0
    };
  });

  const styles = Object.keys(styleCounts).map(s => ({ style: s, count: styleCounts[s] }));

  return {
    totalProfiles: list.length,
    averageFitScore: Math.round(totalScore / total),
    highReadinessCount: highReadiness,
    dominantElement: topElem,
    zodiacElementBreakdown: elements,
    divisionDistribution: divisions,
    workStyleBreakdown: styles
  };
});
