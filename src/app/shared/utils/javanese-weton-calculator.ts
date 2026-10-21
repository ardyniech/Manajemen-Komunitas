import { JavaneseWeton } from '../models/personality-talent.model';

const DAYS = [
  { name: 'Minggu', neptu: 5 },
  { name: 'Senin', neptu: 4 },
  { name: 'Selasa', neptu: 3 },
  { name: 'Rabu', neptu: 7 },
  { name: 'Kamis', neptu: 8 },
  { name: 'Jumat', neptu: 6 },
  { name: 'Sabtu', neptu: 9 }
];

const PASARANS = [
  { name: 'Legi', neptu: 5 },
  { name: 'Pahing', neptu: 9 },
  { name: 'Pon', neptu: 7 },
  { name: 'Wage', neptu: 4 },
  { name: 'Kliwon', neptu: 8 }
];

const WATAK_MAP: Record<number, { watak: string; desc: string; pro: string; peran: string }> = {
  7: { watak: 'Pendito Sakti', desc: 'Suka mengamati, tenang, pendengar bijak, pemikir mendalam.', pro: 'Ketelitian & perumusan nilai etika', peran: 'Dewan Etik & Penasehat' },
  8: { watak: 'Lakuning Geni', desc: 'Penuh semangat, pemberani, berpendirian teguh, pantang menyerah.', pro: 'Eksekusi lapangan & penggerak massa', peran: 'Divisi Operasional & Acara' },
  9: { watak: 'Lakuning Angin', desc: 'Fleksibel, adaptif, komunikatif, mudah berbaur dengan berbagai kalangan.', pro: 'Komunikasi & negosiasi santun', peran: 'Humas & Kemitraan Eksternal' },
  10: { watak: 'Pendito Mbangun', desc: 'Kritis, analitis, suka keteraturan, terstruktur dalam menyusun sistem.', pro: 'Perencanaan sistematis & IT', peran: 'Sekretariat & Teknologi Media' },
  11: { watak: 'Lakuning Setan', desc: 'Pemberani, tahan banting, memiliki tekad kuat dan loyalitas tinggi.', pro: 'Pengawalan keamanan & penertiban aturan', peran: 'Dewan Etik & Keamanan Komunitas' },
  12: { watak: 'Lakuning Kembang', desc: 'Menawan, disukai banyak orang, cinta damai, pembawa ketenangan.', pro: 'Pencair suasana & penyatu anggota', peran: 'Divisi Sosial, Relawan & Humas' },
  13: { watak: 'Lakuning Lintang', desc: 'Mandiri, berwibawa, solutif, tenang dalam mengambil keputusan sulit.', pro: 'Kepemimpinan berprinsip kokoh', peran: 'Ketua Umum & Koordinator Divisi' },
  14: { watak: 'Lakuning Mbulan', desc: 'Mencerahkan, teliti, penerang di masa krisis, jujur dan amanah.', pro: 'Kejujuran tinggi & ketelitian pembukuan', peran: 'Bendahara & Keuangan Kas' },
  15: { watak: 'Lakuning Srengenge', desc: 'Berjiwa pemimpin besar, berwawasan luas, membimbing dan mengayomi.', pro: 'Visi jangka panjang & kharisma kepengurusan', peran: 'Ketua Umum & Majelis Pertimbangan' },
  16: { watak: 'Lakuning Bumi', desc: 'Sabar, pemurah, penyantun, pelindung anggota, teguh dalam komitmen.', pro: 'Pengayoman anggota & kepedulian sosial', peran: 'Divisi Sosial & Kesejahteraan Anggota' },
  17: { watak: 'Lakuning Gunung', desc: 'Kokoh, teguh pendirian, berwawasan luas, bijaksana dan dihormati.', pro: 'Ketegasan penegakan tata tertib', peran: 'Dewan Etik & Penjamin Mutu' },
  18: { watak: 'Paripurna Luhur', desc: 'Lengkap lahir batin, bijak bestari, tenang, pembawa kesejukan musyawarah.', pro: 'Resolusi konflik & diplomasi tingkat tinggi', peran: 'Ketua Majelis & Dewan Etik' }
};

export function calculateJavaneseWeton(birthDateStr: string): JavaneseWeton {
  if (!birthDateStr) {
    return {
      dayName: 'Senin', pasaranName: 'Legi', wetonFull: 'Senin Legi', neptu: 9,
      watakUtama: 'Lakuning Angin', karakterKepribadian: 'Adaptif dan komunikatif', kelebihan: 'Komunikasi', rekomendasiPeran: 'Humas'
    };
  }

  const date = new Date(birthDateStr + 'T00:00:00Z');
  const dayIndex = date.getUTCDay(); // 0 = Sunday
  const day = DAYS[dayIndex];

  // Base epoch: 1970-01-01 was Thursday (Kamis) Pahing (Pasaran index 1)
  const epoch = new Date('1970-01-01T00:00:00Z');
  const diffDays = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
  const pasaranIndex = ((diffDays % 5) + 5 + 1) % 5;
  const pasaran = PASARANS[pasaranIndex];

  const totalNeptu = day.neptu + pasaran.neptu;
  const watakInfo = WATAK_MAP[totalNeptu] || WATAK_MAP[13];

  return {
    dayName: day.name,
    pasaranName: pasaran.name,
    wetonFull: `${day.name} ${pasaran.name}`,
    neptu: totalNeptu,
    watakUtama: watakInfo.watak,
    karakterKepribadian: watakInfo.desc,
    kelebihan: watakInfo.pro,
    rekomendasiPeran: watakInfo.peran
  };
}
