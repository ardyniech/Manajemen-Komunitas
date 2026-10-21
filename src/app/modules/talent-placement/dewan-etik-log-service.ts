import { signal } from '@angular/core';

export type EthicalLogType = 'manual_override' | 'clearance_issued' | 'smart_match_applied' | 'integrity_note';

export interface DewanEtikActivityLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  targetMemberId: string;
  targetMemberName: string;
  targetMemberNumber: string;
  type: EthicalLogType;
  typeLabel: string;
  previousPlacement?: string;
  newPlacement: string;
  notes: string;
}

export const LOG_TYPE_META: Record<EthicalLogType, { icon: string; badgeClass: string; tagClass: string }> = {
  manual_override: { icon: 'swap_horiz', badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-100', tagClass: 'bg-indigo-100 text-indigo-800' },
  clearance_issued: { icon: 'verified', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100', tagClass: 'bg-emerald-100 text-emerald-800' },
  smart_match_applied: { icon: 'auto_awesome', badgeClass: 'bg-purple-50 text-purple-700 border border-purple-100', tagClass: 'bg-purple-100 text-purple-800' },
  integrity_note: { icon: 'edit_note', badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200', tagClass: 'bg-slate-100 text-slate-700' }
};

const STORAGE_KEY = 'komunika_dewan_etik_activity_logs';

const INITIAL_LOGS: DewanEtikActivityLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-09-29 16:40 WIB',
    actorName: 'Ardy Syafii',
    actorRole: 'Ketua Majelis Etik',
    targetMemberId: 'mem-1',
    targetMemberName: 'Raden Mas Suryo',
    targetMemberNumber: 'KM-2026-001',
    type: 'manual_override',
    typeLabel: 'Penyesuaian Manual Formasi',
    previousPlacement: 'Humas & Mitra',
    newPlacement: 'Ketua Presidium',
    notes: 'Kandidat memiliki neptu weton 16 (Lakuning Srengenge) dan integritas 95%, diputuskan layak memimpin presidium.'
  },
  {
    id: 'log-102',
    timestamp: '2026-09-28 14:15 WIB',
    actorName: 'Dewan Pengawas AD/ART',
    actorRole: 'Auditor Internal',
    targetMemberId: 'mem-3',
    targetMemberName: 'Budi Santoso',
    targetMemberNumber: 'KM-2026-003',
    type: 'clearance_issued',
    typeLabel: 'Penerbitan Klirens Sah',
    previousPlacement: 'Bendahara Kas',
    newPlacement: 'Bendahara Kas',
    notes: 'Pemeriksaan kepatuhan finansial bersih, tidak ditemukan konflik perangkapan jabatan struktural.'
  },
  {
    id: 'log-103',
    timestamp: '2026-09-27 10:20 WIB',
    actorName: 'Sistem Triad',
    actorRole: 'Algoritma Rekomendasi',
    targetMemberId: 'mem-2',
    targetMemberName: 'Siti Nurhaliza',
    targetMemberNumber: 'KM-2026-002',
    type: 'smart_match_applied',
    typeLabel: 'Penerapan Rekomendasi Triad',
    previousPlacement: 'Sekretariat',
    newPlacement: 'Bendahara Kas',
    notes: 'Penyelarasan bakat numerik & watak weton Lakuning Mbulan dengan kecocokan 94% diterapkan ke profil.'
  }
];

function loadLogs(): DewanEtikActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_LOGS;
  } catch {
    return INITIAL_LOGS;
  }
}

function saveLogs(logs: DewanEtikActivityLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.warn('Gagal menyimpan log dewan etik', err);
  }
}

export const dewanEtikLogsState = signal<DewanEtikActivityLog[]>(loadLogs());

export function logPlacementChange(params: {
  actorName: string;
  actorRole: string;
  targetMemberId: string;
  targetMemberName: string;
  targetMemberNumber: string;
  type: EthicalLogType;
  typeLabel: string;
  previousPlacement?: string;
  newPlacement: string;
  notes: string;
}): void {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
    now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const newLog: DewanEtikActivityLog = {
    id: `log-${Date.now()}`,
    timestamp: dateStr,
    ...params
  };

  const updated = [newLog, ...dewanEtikLogsState()];
  dewanEtikLogsState.set(updated);
  saveLogs(updated);
}
