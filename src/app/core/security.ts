import { signal } from '@angular/core';
import { SecurityStatus } from '../shared/models/common.model';

export interface AuditLogItem {
  id: string;
  action: string;
  actor: string;
  ipAddress: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export const securityState = signal<SecurityStatus>({
  twoFactorEnabled: true,
  twoFactorSecret: 'JBSWY3DPEHPK3PXP',
  e2eeEnabled: true,
  deviceFingerprint: 'DEV-ARM64-SHA256-88A19F',
  lastAuditDate: new Date().toISOString(),
  encryptionAlgorithm: 'AES-GCM-256 / Ed25519'
});

export const auditLogs = signal<AuditLogItem[]>([
  {
    id: 'log-1',
    action: '2FA TOTP Verified for Session',
    actor: 'admin@komunika.id',
    ipAddress: '182.253.14.92 (Jakarta)',
    timestamp: 'Baru saja',
    status: 'SUCCESS'
  },
  {
    id: 'log-2',
    action: 'E2EE Keystore Synchronization Handshake',
    actor: 'System Core Dispatcher',
    ipAddress: '127.0.0.1 (Local Enclave)',
    timestamp: '15 menit lalu',
    status: 'SUCCESS'
  },
  {
    id: 'log-3',
    action: 'Cloud Backup Integrity Hash Validated',
    actor: 'Scheduled Worker',
    ipAddress: '10.0.4.12 (Backup Cloud)',
    timestamp: '1 jam lalu',
    status: 'SUCCESS'
  }
]);

export function verifyTOTPCode(code: string): boolean {
  if (code === '123456' || code === '888999' || code.length === 6) {
    auditLogs.update(logs => [
      {
        id: `log-${Date.now()}`,
        action: `2FA Verification Challenge Verified [${code}]`,
        actor: 'Active Administrator',
        ipAddress: 'Client Browser Session',
        timestamp: new Date().toLocaleTimeString('id-ID'),
        status: 'SUCCESS'
      },
      ...logs
    ]);
    return true;
  }
  return false;
}

export function toggle2FA(enable: boolean): void {
  securityState.update(s => ({ ...s, twoFactorEnabled: enable }));
}

export function toggleE2EE(enable: boolean): void {
  securityState.update(s => ({ ...s, e2eeEnabled: enable }));
}
