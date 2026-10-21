export interface ExternalServiceConfig {
  id: string;
  category: 'payment' | 'email' | 'calendar' | 'messaging';
  providerName: string;
  serviceTitle: string;
  description: string;
  iconName: string;
  isConnected: boolean;
  environment: 'sandbox' | 'production';
  apiKey?: string;
  secretKey?: string;
  merchantOrListId?: string;
  webhookUrl?: string;
  lastPingStatus?: 'success' | 'failed' | 'pending';
  lastPingLatencyMs?: number;
  lastSyncedAt?: string;
  syncCountToday?: number;
}

export interface WebhookConfig {
  id: string;
  name: string;
  targetUrl: string;
  events: ('member.registered' | 'dues.paid' | 'forum.topic_created' | 'backup.completed')[];
  secretKey: string;
  isActive: boolean;
  lastTriggeredAt?: string;
  lastStatus?: 'success' | 'failed';
}

export interface CommunitySettings {
  communityName: string;
  tagline: string;
  establishedDate: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  monthlyDuesNominal: number;
  currency: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  autoBackupIntervalHours: number;
  e2eeDefault: boolean;
}
