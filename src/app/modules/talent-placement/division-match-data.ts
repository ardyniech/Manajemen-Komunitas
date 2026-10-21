import { TalentAnalyticsSummary } from './talent-analytics-service';
import { talentProfilesState } from '../../core/talent/talent.service';
import { membersState } from '../../shared/utils/storage';

export interface DivisionMatchDatum {
  id: string;
  label: string;
  shortLabel: string;
  count: number;
  avgScore: number;
  color: string;
  percentOfTotal: number;
  trait: string;
  focusArea: string;
  readinessLabel: string;
  candidateNames: string[];
}

const DIVISION_META: Record<string, { color: string; shortLabel: string; trait: string; focus: string }> = {
  ketua_umum: { color: '#4f46e5', shortLabel: 'Ketua', trait: 'Lakuning Lintang / Srengenge • Visioner', focus: 'Arah Kebijakan & Stabilitas Presidium' },
  keuangan_bendahara: { color: '#059669', shortLabel: 'Bendahara', trait: 'Lakuning Mbulan • Analitis & Jujur', focus: 'Transparansi Kas, Iuran & Akuntansi' },
  dewan_etik: { color: '#7c3aed', shortLabel: 'Dewan Etik', trait: 'Pendito Sakti / Gunung • Penjaga Nilai', focus: 'Audit Kepatuhan AD/ART & Mediasi' },
  humas_komunikasi: { color: '#2563eb', shortLabel: 'Humas', trait: 'Lakuning Angin • Diplomat & Luwes', focus: 'Kemitraan, Humas & Jaringan Eksternal' },
  acara_operasional: { color: '#d97706', shortLabel: 'Acara', trait: 'Lakuning Geni • Eksekutor Lapangan', focus: 'Manajemen Logistik & Kepanitiaan' },
  teknologi_media: { color: '#0891b2', shortLabel: 'IT & Media', trait: 'Pendito Mbangun • Inovasi Sistem', focus: 'Platform Digital, Publikasi & Media' }
};

export function transformDivisionMatchData(summary: TalentAnalyticsSummary): DivisionMatchDatum[] {
  const total = summary.totalProfiles || 1;
  const talents = talentProfilesState();
  const members = membersState();

  return summary.divisionDistribution.map(d => {
    const meta = DIVISION_META[d.division] || {
      color: '#64748b', shortLabel: d.label, trait: 'Karakter Adaptif Komunitas', focus: 'Pengembangan Organisasi'
    };

    const candidates = talents
      .filter(t => t.recommendedDivision === d.division)
      .map(t => {
        const mem = members.find(m => m.id === t.memberId);
        return mem ? `${mem.fullName} (${t.fitScore}%)` : `Anggota #${t.memberId}`;
      })
      .slice(0, 3);

    const readiness = d.avgScore >= 88 ? 'Sangat Selaras' : d.avgScore >= 75 ? 'Optimal' : 'Perlu Penguatan';

    return {
      id: d.division,
      label: d.label,
      shortLabel: meta.shortLabel,
      count: d.count,
      avgScore: d.avgScore || 0,
      color: meta.color,
      percentOfTotal: Math.round((d.count / total) * 100),
      trait: meta.trait,
      focusArea: meta.focus,
      readinessLabel: readiness,
      candidateNames: candidates
    };
  });
}
