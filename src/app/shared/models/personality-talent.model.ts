export type DivisionCategory = 
  | 'ketua_umum'
  | 'sekretariat'
  | 'keuangan_bendahara'
  | 'humas_komunikasi'
  | 'acara_operasional'
  | 'dewan_etik'
  | 'teknologi_media'
  | 'sosial_relawan';

export type WorkStyle = 'analitis' | 'visioner' | 'eksekutor' | 'diplomat' | 'pelindung_nilai';

export interface JavaneseWeton {
  dayName: string;         // e.g. Senin, Selasa
  pasaranName: string;     // Legi, Pahing, Pon, Wage, Kliwon
  wetonFull: string;       // e.g. "Senin Pon"
  neptu: number;           // e.g. 4 + 7 = 11
  watakUtama: string;      // e.g. "Lakuning Bintang", "Wasesa Segara"
  karakterKepribadian: string;
  kelebihan: string;
  rekomendasiPeran: string;
}

export interface AstrologyProfile {
  zodiacSign: string;      // Leo, Virgo, etc.
  element: 'Api' | 'Tanah' | 'Udara' | 'Air';
  simbol: string;
  sifatKepemimpinan: string;
  shio: string;            // Tikus, Kerbau, Naga, dll.
  shioElement: string;     // Kayu, Api, Tanah, Logam, Air
  kekuatanSosial: string;
}

export interface MemberPersonalTalent {
  memberId: string;
  birthDate: string;       // YYYY-MM-DD
  birthPlace?: string;
  preferredDivisions: DivisionCategory[];
  workStyle: WorkStyle;
  topSkills: string[];
  weeklyHoursAvailable: number;
  leadershipExperience: string;
  aspirations: string;
  weton: JavaneseWeton;
  astrology: AstrologyProfile;
  dewanEtikNotes?: string;
  recommendedDivision: DivisionCategory;
  fitScore: number;        // 0 - 100%
  updatedAt: string;
}
