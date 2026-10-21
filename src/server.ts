import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

// In-memory mock storage for REST API endpoints
const apiMembers = [
  { id: 'mem-001', memberNumber: 'KM-2023-001', fullName: 'Arya Pratama', email: 'arya.pratama@komunika.id', role: 'Super Administrator', status: 'aktif' },
  { id: 'mem-002', memberNumber: 'KM-2023-002', fullName: 'Siti Rahmawati', email: 'siti.rahma@gmail.com', role: 'Bendahara Kas', status: 'aktif' },
  { id: 'mem-003', memberNumber: 'KM-2023-003', fullName: 'Dimas Setiawan', email: 'dimas.dev@yahoo.co.id', role: 'Ketua Komunitas', status: 'aktif' }
];

const apiEvents = [
  { id: 'evt-1', title: 'Meetup Komunitas & Hackathon 2026', date: '2026-10-15', location: 'Jakarta Creative Hub & Online', registeredAttendees: 42 },
  { id: 'evt-2', title: 'Workshop PWA & Angular 21 Modern Architecture', date: '2026-11-05', location: 'Online via Google Meet', registeredAttendees: 88 }
];

const apiPayments = [
  { id: 'trx-1', transactionNumber: 'TRX-2026-0901', amount: 50000, type: 'iuran', memberName: 'Arya Pratama', status: 'lunas', method: 'qris' },
  { id: 'trx-2', transactionNumber: 'TRX-2026-0902', amount: 50000, type: 'iuran', memberName: 'Siti Rahmawati', status: 'lunas', method: 'transfer_bank' }
];

// Helper calculations for Javanese Weton, Astrology & Shio backend endpoint
const PASARAN_NAMES = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
const PASARAN_NEPTUS = [5, 9, 7, 4, 8];
const DAY_NEPTUS = [5, 4, 3, 7, 8, 6, 9]; // Minggu..Sabtu
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const SHIO_ANIMALS = ['Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing', 'Monyet', 'Ayam', 'Anjing', 'Babi'];
const SHIO_ELEMS = ['Logam', 'Air', 'Kayu', 'Api', 'Tanah'];

// --- RESTful API Endpoints ---
app.get('/api/members', (req, res) => res.json({ status: 'success', count: apiMembers.length, data: apiMembers }));

app.post('/api/talent/assessment', (req, res) => {
  const { memberId, birthDate, birthPlace, preferredDivisions, workStyle, topSkills, aspirations, weeklyHoursAvailable } = req.body || {};
  if (!birthDate) {
    res.status(400).json({ status: 'error', message: 'Tanggal lahir (birthDate) wajib disertakan' });
    return;
  }

  const d = new Date(birthDate + 'T00:00:00Z');
  const dayIdx = d.getUTCDay();
  const epoch = new Date('1970-01-01T00:00:00Z');
  const diffDays = Math.floor((d.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
  const pasaranIdx = ((diffDays % 5) + 5 + 1) % 5;
  const totalNeptu = DAY_NEPTUS[dayIdx] + PASARAN_NEPTUS[pasaranIdx];
  const wetonFull = `${DAY_NAMES[dayIdx]} ${PASARAN_NAMES[pasaranIdx]}`;

  const [yStr, mStr, dtStr] = birthDate.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const dt = parseInt(dtStr, 10);

  const shio = SHIO_ANIMALS[((y - 1900) % 12 + 12) % 12];
  const shioElem = SHIO_ELEMS[Math.floor(((y - 1900) % 10 + 10) % 10 / 2)];

  let zodiac = 'Capricorn';
  let elem = 'Tanah';
  if ((m === 3 && dt >= 21) || (m === 4 && dt <= 19)) { zodiac = 'Aries'; elem = 'Api'; }
  else if ((m === 4 && dt >= 20) || (m === 5 && dt <= 20)) { zodiac = 'Taurus'; elem = 'Tanah'; }
  else if ((m === 5 && dt >= 21) || (m === 6 && dt <= 20)) { zodiac = 'Gemini'; elem = 'Udara'; }
  else if ((m === 6 && dt >= 21) || (m === 7 && dt <= 22)) { zodiac = 'Cancer'; elem = 'Air'; }
  else if ((m === 7 && dt >= 23) || (m === 8 && dt <= 22)) { zodiac = 'Leo'; elem = 'Api'; }
  else if ((m === 8 && dt >= 23) || (m === 9 && dt <= 22)) { zodiac = 'Virgo'; elem = 'Tanah'; }
  else if ((m === 9 && dt >= 23) || (m === 10 && dt <= 22)) { zodiac = 'Libra'; elem = 'Udara'; }
  else if ((m === 10 && dt >= 23) || (m === 11 && dt <= 21)) { zodiac = 'Scorpio'; elem = 'Air'; }
  else if ((m === 11 && dt >= 22) || (m === 12 && dt <= 21)) { zodiac = 'Sagittarius'; elem = 'Api'; }
  else if ((m === 1 && dt >= 20) || (m === 2 && dt <= 18)) { zodiac = 'Aquarius'; elem = 'Udara'; }
  else if ((m === 2 && dt >= 19) || (m === 3 && dt <= 20)) { zodiac = 'Pisces'; elem = 'Air'; }

  const prefs = preferredDivisions || ['humas_komunikasi'];
  let recDiv = prefs[0] || 'humas_komunikasi';
  let score = 92;
  if (prefs.includes('keuangan_bendahara') || workStyle === 'analitis') { recDiv = 'keuangan_bendahara'; score = 96; }
  else if (prefs.includes('dewan_etik') || workStyle === 'pelindung_nilai') { recDiv = 'dewan_etik'; score = 95; }
  else if (prefs.includes('ketua_umum') || workStyle === 'visioner') { recDiv = 'ketua_umum'; score = 94; }

  res.json({
    status: 'success',
    calculatedAt: new Date().toISOString(),
    data: {
      memberId: memberId || 'mem-curr',
      birthDate,
      birthPlace: birthPlace || 'Indonesia',
      preferredDivisions: prefs,
      workStyle: workStyle || 'visioner',
      topSkills: topSkills || ['Komunikasi'],
      weeklyHoursAvailable: Number(weeklyHoursAvailable) || 10,
      aspirations: aspirations || '',
      weton: { dayName: DAY_NAMES[dayIdx], pasaranName: PASARAN_NAMES[pasaranIdx], wetonFull, neptu: totalNeptu, watakUtama: totalNeptu >= 14 ? 'Lakuning Lintang' : 'Lakuning Angin', karakterKepribadian: 'Berkarakter kuat dan adaptif', kelebihan: 'Kepemimpinan & Kolaborasi', rekomendasiPeran: recDiv },
      astrology: { zodiacSign: zodiac, element: elem, simbol: '★', sifatKepemimpinan: 'Visioner dan komunikatif', shio, shioElement: shioElem, kekuatanSosial: `Shio ${shio} ${shioElem}` },
      recommendedDivision: recDiv,
      fitScore: score,
      processedBy: 'Komunika Personality Engine v2.4 (Backend Core)'
    }
  });
});

app.get('/api/events', (req, res) => res.json({ status: 'success', count: apiEvents.length, data: apiEvents }));
app.get('/api/payments', (req, res) => res.json({ status: 'success', totalTransactions: apiPayments.length, balance: 18450000, data: apiPayments }));

/** Serve static files from /browser */
app.use(express.static(browserDistFolder, { maxAge: '1y', index: false, redirect: false }));

/** Handle all other requests by rendering the Angular application. */
app.use((req, res, next) => {
  angularApp.handle(req).then((response) => response ? writeResponseToNodeResponse(response, res) : next()).catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
