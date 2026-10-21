import { Member } from '../models/member.model';

export function buildWhatsAppRecapText(members: Member[]): string {
  const paidCount = members.filter(m => m.duesPaidUntil >= '2026-09-01' && m.status === 'aktif').length;
  const dueSoonCount = members.filter(m => m.duesPaidUntil < '2026-09-01' && m.status === 'aktif').length;
  const pendingCount = members.filter(m => m.status === 'pending').length;

  const lines = [
    '*LAPORAN IURAN KAS ANGGOTA KOMUNITAS 2026*',
    `*Tanggal:* ${new Date().toLocaleDateString('id-ID')}`,
    '----------------------------------------'
  ];

  members.forEach((m, i) => {
    const st = m.status === 'aktif' ? `[Lunas s/d ${m.duesPaidUntil}]` : '[Belum Lunas]';
    lines.push(`${i + 1}. ${m.fullName} : ${m.notes || 'Belum bayar'} ${st}`);
  });

  lines.push('----------------------------------------');
  lines.push(`Total Anggota: ${members.length}`);
  lines.push(`Lunas: ${paidCount} | Perlu Perpanjang: ${dueSoonCount} | Pending: ${pendingCount}`);
  lines.push('Nominal Iuran: Rp 50.000 / bulan');
  lines.push('Rekening Kas: BCA 8720-9988-1122 a/n KAS BESAR KOMUNIKA');

  return lines.join('\n');
}
