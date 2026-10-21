import { AstrologyProfile } from '../models/personality-talent.model';

const SHIO_ANIMALS = ['Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing', 'Monyet', 'Ayam', 'Anjing', 'Babi'];
const SHIO_ELEMENTS = ['Logam', 'Air', 'Kayu', 'Api', 'Tanah'];

export function calculateAstrologyAndShio(birthDateStr: string): AstrologyProfile {
  if (!birthDateStr) {
    return {
      zodiacSign: 'Aries', element: 'Api', simbol: '♈',
      sifatKepemimpinan: 'Pionir dan energik', shio: 'Naga', shioElement: 'Kayu', kekuatanSosial: 'Percaya diri dan berwibawa'
    };
  }

  const [yearStr, monthStr, dayStr] = birthDateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Shio calculation (Base: 1900 was Rat)
  const shioIndex = ((year - 1900) % 12 + 12) % 12;
  const shioName = SHIO_ANIMALS[shioIndex];
  const shioElemIndex = Math.floor(((year - 1900) % 10 + 10) % 10 / 2);
  const shioElem = SHIO_ELEMENTS[shioElemIndex];

  // Western Zodiac
  let zodiac = 'Capricorn';
  let elem: 'Api' | 'Tanah' | 'Udara' | 'Air' = 'Tanah';
  let symbol = '♑';
  let lead = 'Disiplin, bertanggung jawab, dan strategis';

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    zodiac = 'Aries'; elem = 'Api'; symbol = '♈'; lead = 'Pemberani, pengambil inisiatif, dan cepat tanggap';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    zodiac = 'Taurus'; elem = 'Tanah'; symbol = '♉'; lead = 'Stabil, setia, teliti dalam mengelola sumber daya';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    zodiac = 'Gemini'; elem = 'Udara'; symbol = '♊'; lead = 'Cerdas, komunikatif, ahli diplomasi dan multi-tasking';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    zodiac = 'Cancer'; elem = 'Air'; symbol = '♋'; lead = 'Penuh empati, pelindung anggota, dan intuitif';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    zodiac = 'Leo'; elem = 'Api'; symbol = '♌'; lead = 'Kharismatik, memotivasi, dan berjiwa pemimpin sentral';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    zodiac = 'Virgo'; elem = 'Tanah'; symbol = '♍'; lead = 'Analitis, perfeksionis, sangat akurat dalam pembukuan';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    zodiac = 'Libra'; elem = 'Udara'; symbol = '♎'; lead = 'Adil, objektif, penengah konflik yang disegani';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    zodiac = 'Scorpio'; elem = 'Air'; symbol = '♏'; lead = 'Fokus, menjaga integritas, tegas dalam penegakan kode etik';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    zodiac = 'Sagittarius'; elem = 'Api'; symbol = '♐'; lead = 'Visioner, optimis, memperluas jejaring dan kolaborasi';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    zodiac = 'Aquarius'; elem = 'Udara'; symbol = '♒'; lead = 'Inovatif, visioner teknologi, dan berwawasan masa depan';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    zodiac = 'Pisces'; elem = 'Air'; symbol = '♓'; lead = 'Humanis, mengayomi aspirasi, dan berjiwa relawan';
  }

  return {
    zodiacSign: zodiac,
    element: elem,
    simbol: symbol,
    sifatKepemimpinan: lead,
    shio: shioName,
    shioElement: shioElem,
    kekuatanSosial: `Shio ${shioName} unsur ${shioElem}: memiliki daya adaptasi tinggi dan loyalitas kuat.`
  };
}
