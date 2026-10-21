import { DewanEtikActivityLog } from './dewan-etik-log-service';

export function exportLogsToCsv(logs: DewanEtikActivityLog[]): void {
  if (typeof window === 'undefined' || logs.length === 0) return;

  const headers = ['Waktu', 'Inisiator', 'Peran Inisiator', 'Anggota Target', 'No KTA', 'Kategori Aksi', 'Posisi Awal', 'Posisi Baru', 'Pertimbangan'];
  const rows = logs.map(l => [
    `"${l.timestamp}"`,
    `"${l.actorName}"`,
    `"${l.actorRole}"`,
    `"${l.targetMemberName}"`,
    `"${l.targetMemberNumber}"`,
    `"${l.typeLabel}"`,
    `"${l.previousPlacement || '-'}"`,
    `"${l.newPlacement}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `audit-dewan-etik-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
