export type Language = 'id' | 'en';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'payment' | 'member';
  timestamp: string;
  read: boolean;
  linkUrl?: string;
}

export interface CloudBackupRecord {
  id: string;
  createdAt: string;
  fileName: string;
  sizeBytes: number;
  destination: 'Google Drive' | 'Dropbox' | 'AWS S3' | 'Local Safe';
  status: 'synced' | 'pending' | 'failed';
  checksum: string;
}

export interface SecurityStatus {
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  e2eeEnabled: boolean;
  deviceFingerprint: string;
  lastAuditDate: string;
  encryptionAlgorithm: string;
}
