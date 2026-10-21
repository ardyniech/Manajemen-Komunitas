import { MemberHiddenPersonalityMetadata } from '../../shared/models/member.model';
import { calculateJavaneseWeton } from '../../shared/utils/javanese-weton-calculator';
import { calculateAstrologyAndShio } from '../../shared/utils/astrology-shio-calculator';
import { membersState } from '../../shared/utils/storage';

export function computeMemberPersonalityMetadata(birthDateStr: string): MemberHiddenPersonalityMetadata {
  const weton = calculateJavaneseWeton(birthDateStr);
  const astro = calculateAstrologyAndShio(birthDateStr);

  return {
    birthDate: birthDateStr || '1995-01-01',
    wetonDinten: weton.dayName,
    wetonPasaran: weton.pasaranName,
    wetonFull: weton.wetonFull,
    wetonNeptu: weton.neptu,
    chineseShio: astro.shio,
    shioElement: astro.shioElement,
    westernZodiac: astro.zodiacSign,
    zodiacElement: astro.element,
    computedAt: new Date().toISOString(),
    isConfidential: true
  };
}

export function attachMetadataToMemberProfile(memberId: string, birthDateStr: string): MemberHiddenPersonalityMetadata {
  const meta = computeMemberPersonalityMetadata(birthDateStr);

  membersState.update(list => list.map(m => {
    if (m.id === memberId) {
      return { ...m, hiddenMetadata: meta };
    }
    return m;
  }));

  return meta;
}
