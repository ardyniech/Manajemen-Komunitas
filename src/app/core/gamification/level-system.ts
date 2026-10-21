export interface LevelInfo {
  level: number;
  name: string;
  rankTitle: string;
  nextLevelPoints: number;
  progressPercent: number;
}

export function calculateLevel(points: number): LevelInfo {
  if (points >= 1000) {
    return { level: 5, name: 'Platinum Legend', rankTitle: 'Tokoh Kehormatan', nextLevelPoints: 1000, progressPercent: 100 };
  } else if (points >= 600) {
    const progress = Math.min(100, Math.round(((points - 600) / 400) * 100));
    return { level: 4, name: 'Gold Leader', rankTitle: 'Penggerak Utama', nextLevelPoints: 1000, progressPercent: progress };
  } else if (points >= 300) {
    const progress = Math.min(100, Math.round(((points - 300) / 300) * 100));
    return { level: 3, name: 'Silver Member', rankTitle: 'Kontributor Aktif', nextLevelPoints: 600, progressPercent: progress };
  } else if (points >= 100) {
    const progress = Math.min(100, Math.round(((points - 100) / 200) * 100));
    return { level: 2, name: 'Bronze Member', rankTitle: 'Warga Terdaftar', nextLevelPoints: 300, progressPercent: progress };
  } else {
    const progress = Math.min(100, Math.round((points / 100) * 100));
    return { level: 1, name: 'Newbie Member', rankTitle: 'Anggota Baru', nextLevelPoints: 100, progressPercent: progress };
  }
}
