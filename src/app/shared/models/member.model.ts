export type MemberStatus = 'aktif' | 'pending' | 'nonaktif';
export type MemberTier = 'reguler' | 'pengurus' | 'vip' | 'alumni';

export interface MemberHiddenPersonalityMetadata {
  birthDate: string;
  wetonDinten: string;     // e.g. "Senin"
  wetonPasaran: string;    // e.g. "Pon"
  wetonFull: string;       // "Senin Pon"
  wetonNeptu: number;      // 11
  chineseShio: string;     // "Kerbau"
  shioElement: string;     // "Logam"
  westernZodiac: string;   // "Taurus"
  zodiacElement: string;   // "Tanah"
  computedAt: string;
  isConfidential: boolean; // Always true (hidden from public directory, only for Admin & Dewan Etik)
}

export interface Member {
  id: string;
  memberNumber: string;
  fullName: string;
  email: string;
  phone: string;
  roleId: string;
  tier: MemberTier;
  status: MemberStatus;
  joinedAt: string;
  avatarUrl: string;
  duesPaidUntil: string;
  notes?: string;
  twoFactorActive: boolean;
  hiddenMetadata?: MemberHiddenPersonalityMetadata;
}

export interface MemberFilter {
  search: string;
  status: 'all' | MemberStatus;
  roleId: 'all' | string;
  tier: 'all' | MemberTier;
}
