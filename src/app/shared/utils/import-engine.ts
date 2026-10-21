import { Member, MemberStatus, MemberTier } from '../models/member.model';

export interface ImportPreviewResult {
  validRows: Partial<Member>[];
  errorRows: { line: number; rawText: string; reason: string }[];
  detectedDelimiter: string;
  totalParsed: number;
}

export function parseCsvOrText(rawText: string): ImportPreviewResult {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) {
    return { validRows: [], errorRows: [], detectedDelimiter: ',', totalParsed: 0 };
  }

  const sample = lines[0];
  let delimiter = ',';
  if (sample.includes(';') && !sample.includes(',')) delimiter = ';';
  else if (sample.includes('\t')) delimiter = '\t';
  else if (sample.includes('|')) delimiter = '|';

  const validRows: Partial<Member>[] = [];
  const errorRows: { line: number; rawText: string; reason: string }[] = [];

  const startIndex = lines[0].toLowerCase().includes('nama') || lines[0].toLowerCase().includes('email') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const cols = line.split(delimiter).map(c => c.replace(/^["']|["']$/g, '').trim());

    if (cols.length < 2) {
      errorRows.push({ line: i + 1, rawText: line, reason: 'Kolom minimal: Nama dan Email' });
      continue;
    }

    const fullName = cols[0];
    const email = cols[1];
    const phone = cols[2] ?? '-';
    const tierRaw = (cols[3] ?? 'reguler').toLowerCase();
    const statusRaw = (cols[4] ?? 'aktif').toLowerCase();

    if (!fullName || fullName.length < 2) {
      errorRows.push({ line: i + 1, rawText: line, reason: 'Nama tidak valid / terlalu pendek' });
      continue;
    }
    if (!email || !email.includes('@')) {
      errorRows.push({ line: i + 1, rawText: line, reason: 'Format email tidak valid' });
      continue;
    }

    const tier: MemberTier = ['pengurus', 'vip', 'alumni'].includes(tierRaw) ? (tierRaw as MemberTier) : 'reguler';
    const status: MemberStatus = ['pending', 'nonaktif'].includes(statusRaw) ? (statusRaw as MemberStatus) : 'aktif';

    validRows.push({
      fullName,
      email,
      phone,
      tier,
      status,
      duesPaidUntil: '2026-12-31'
    });
  }

  return {
    validRows,
    errorRows,
    detectedDelimiter: delimiter === '\t' ? 'Tab' : delimiter,
    totalParsed: lines.length - startIndex
  };
}
