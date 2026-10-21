import jsPDF from 'jspdf';
import { FinanceTransaction } from '../models/finance.model';
import { Member } from '../models/member.model';

export function exportToCSV(filename: string, rows: Record<string, unknown>[]): void {
  if (!rows || rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const csvContent = [
    header,
    ...rows.map(row =>
      keys.map(k => {
        const val = row[k] ?? '';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(',')
    )
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(filename: string, rows: Record<string, unknown>[]): void {
  // Real Excel-compatible TSV with .xls extension
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  let content = headers.join('\t') + '\n';
  rows.forEach(r => {
    content += headers.map(h => String(r[h] ?? '').replace(/[\t\n\r]/g, ' ')).join('\t') + '\n';
  });

  const blob = new Blob(['\uFEFF' + content], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xls`;
  link.click();
}

export function exportFinancePDF(title: string, transactions: FinanceTransaction[], totalIn: number, totalOut: number): void {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 28);
  doc.text(`Total Pemasukan: Rp ${totalIn.toLocaleString('id-ID')}`, 14, 35);
  doc.text(`Total Pengeluaran: Rp ${totalOut.toLocaleString('id-ID')}`, 14, 42);
  doc.text(`Sisa Saldo Kas: Rp ${(totalIn - totalOut).toLocaleString('id-ID')}`, 14, 49);

  let y = 60;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('No. Transaksi', 14, y);
  doc.text('Tanggal', 52, y);
  doc.text('Kategori', 80, y);
  doc.text('Nominal (IDR)', 140, y);
  doc.text('Status', 180, y);
  doc.setFont('helvetica', 'normal');

  y += 4;
  doc.line(14, y, 196, y);
  y += 6;

  transactions.slice(0, 25).forEach(tx => {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    const prefix = tx.type === 'pengeluaran' ? '-' : '+';
    doc.setFontSize(9);
    doc.text(tx.transactionNumber, 14, y);
    doc.text(tx.date, 52, y);
    doc.text(tx.category.substring(0, 22), 80, y);
    doc.text(`${prefix} ${tx.amount.toLocaleString('id-ID')}`, 140, y);
    doc.text(tx.status.toUpperCase(), 180, y);
    y += 7;
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
}

export function exportMembersPDF(members: Member[]): void {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Daftar Anggota Komunitas', 14, 20);
  doc.setFontSize(10);
  doc.text(`Total Anggota: ${members.length} Orang | Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);

  let y = 40;
  doc.setFont('helvetica', 'bold');
  doc.text('No. Anggota', 14, y);
  doc.text('Nama Lengkap', 50, y);
  doc.text('Email', 105, y);
  doc.text('Status', 165, y);
  doc.setFont('helvetica', 'normal');
  y += 4;
  doc.line(14, y, 196, y);
  y += 6;

  members.forEach(m => {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(9);
    doc.text(m.memberNumber, 14, y);
    doc.text(m.fullName.substring(0, 24), 50, y);
    doc.text(m.email.substring(0, 26), 105, y);
    doc.text(m.status.toUpperCase(), 165, y);
    y += 7;
  });

  doc.save('laporan_anggota_komunitas.pdf');
}
