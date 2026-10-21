import { signal } from '@angular/core';
import { Member } from '../models/member.model';
import { FinanceTransaction } from '../models/finance.model';
import { ForumTopic } from '../models/forum.model';
import { UserRole } from '../models/role.model';
import { CommunitySettings, ExternalServiceConfig, WebhookConfig } from '../models/integration.model';
import { AppNotification, CloudBackupRecord } from '../models/common.model';
import { INITIAL_COMMUNITY_SETTINGS, INITIAL_MEMBERS, INITIAL_ROLES } from '../../core/initial-data';
import { INITIAL_EXTERNAL_SERVICES, INITIAL_TOPICS, INITIAL_TRANSACTIONS, INITIAL_WEBHOOKS } from '../../core/initial-data-extra';
import { APP_CONFIG } from '../../core/config';
import { computeMemberPersonalityMetadata } from '../../core/talent/member-metadata-calculation.service';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(APP_CONFIG.storageKeyPrefix + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(APP_CONFIG.storageKeyPrefix + key, JSON.stringify(data));
  } catch (err) {
    console.warn('Storage save failed', err);
  }
}

function enrichMemberMetadata(m: Member): Member {
  if (m.hiddenMetadata) return m;
  const sampleDates: Record<string, string> = {
    'mem-001': '1988-08-17',
    'mem-002': '1992-04-12',
    'mem-003': '1995-11-28',
    'mem-004': '1990-07-05',
    'mem-005': '1993-01-20'
  };
  const bdate = sampleDates[m.id] || '1993-06-15';
  return { ...m, hiddenMetadata: computeMemberPersonalityMetadata(bdate) };
}

function loadMembers(): Member[] {
  const loaded = load<Member[]>('members', INITIAL_MEMBERS);
  const base = (!Array.isArray(loaded) || loaded.length < 50) ? INITIAL_MEMBERS : loaded;
  return base.map(enrichMemberMetadata);
}

export const membersState = signal<Member[]>(loadMembers());
export const transactionsState = signal<FinanceTransaction[]>(load('transactions', INITIAL_TRANSACTIONS));
export const topicsState = signal<ForumTopic[]>(load('topics', INITIAL_TOPICS));
export const rolesState = signal<UserRole[]>(load('roles', INITIAL_ROLES));
export const settingsState = signal<CommunitySettings>(load('settings', INITIAL_COMMUNITY_SETTINGS));
export const webhooksState = signal<WebhookConfig[]>(load('webhooks', INITIAL_WEBHOOKS));
export const externalServicesState = signal<ExternalServiceConfig[]>(load('external_services', INITIAL_EXTERNAL_SERVICES));

export const notificationsState = signal<AppNotification[]>([
  { id: 'notif-1', title: 'Pembayaran Iuran Berhasil', message: 'Iuran kas sebesar Rp 150.000 telah diverifikasi via QRIS.', type: 'payment', timestamp: '5 menit lalu', read: false },
  { id: 'notif-2', title: 'Pendaftaran Anggota Baru', message: 'Rizky Fauzi telah bergabung ke komunitas.', type: 'member', timestamp: '2 jam lalu', read: true }
]);

export const backupsState = signal<CloudBackupRecord[]>([
  { id: 'bk-1', createdAt: '2026-09-17 08:00 WIB', fileName: 'komunika_snapshot_20260917.json', sizeBytes: 148520, destination: 'Google Drive', status: 'synced', checksum: 'sha256-e8b417fa8901' }
]);

export function persistAll(): void {
  save('members', membersState());
  save('transactions', transactionsState());
  save('topics', topicsState());
  save('roles', rolesState());
  save('settings', settingsState());
  save('webhooks', webhooksState());
  save('external_services', externalServicesState());
}

export function restoreMockData(): void {
  membersState.set(INITIAL_MEMBERS.map(enrichMemberMetadata));
  transactionsState.set(INITIAL_TRANSACTIONS);
  topicsState.set(INITIAL_TOPICS);
  rolesState.set(INITIAL_ROLES);
  settingsState.set(INITIAL_COMMUNITY_SETTINGS);
  webhooksState.set(INITIAL_WEBHOOKS);
  externalServicesState.set(INITIAL_EXTERNAL_SERVICES);
  persistAll();
}
