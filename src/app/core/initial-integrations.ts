import { ExternalServiceConfig, WebhookConfig } from '../shared/models/integration.model';

export const INITIAL_EXTERNAL_SERVICES: ExternalServiceConfig[] = [
  {
    id: 'srv-midtrans',
    category: 'payment',
    providerName: 'Midtrans Payment Gateway',
    serviceTitle: 'Midtrans Snap & Dynamic QRIS',
    description: 'Proses iuran kas anggota otomatis via QRIS, GoPay, ShopeePay, dan VA Bank.',
    iconName: 'payments',
    isConnected: true,
    environment: 'production',
    apiKey: 'SB-Mid-server-9xK2mP01qR',
    secretKey: 'SB-Mid-client-Lp823mXn',
    merchantOrListId: 'M1092837',
    webhookUrl: 'https://komunika.id/api/webhooks/midtrans',
    lastPingStatus: 'success',
    lastPingLatencyMs: 42,
    lastSyncedAt: '5 menit lalu',
    syncCountToday: 18
  },
  {
    id: 'srv-resend',
    category: 'email',
    providerName: 'Resend / Email Marketing',
    serviceTitle: 'Resend Broadcast & Autoresponder',
    description: 'Kirim email pengumuman, bukti iuran digital, dan newsletter komunitas.',
    iconName: 'mark_email_read',
    isConnected: true,
    environment: 'production',
    apiKey: 're_123456789_AbCdEfGhIjKlMnOp',
    merchantOrListId: 'list_komunika_active_members',
    webhookUrl: 'https://komunika.id/api/webhooks/resend',
    lastPingStatus: 'success',
    lastPingLatencyMs: 65,
    lastSyncedAt: '12 menit lalu',
    syncCountToday: 42
  },
  {
    id: 'srv-gcal',
    category: 'calendar',
    providerName: 'Google Calendar API',
    serviceTitle: 'Google Calendar Event Sync',
    description: 'Sinkronisasi otomatis agenda rapat, meetup, dan tenggat iuran ke kalender.',
    iconName: 'calendar_month',
    isConnected: true,
    environment: 'production',
    apiKey: 'AIzaSyA8x9Q2mP01qR-DemoKey',
    merchantOrListId: 'c_komunika_official@group.calendar.google.com',
    lastPingStatus: 'success',
    lastPingLatencyMs: 110,
    lastSyncedAt: '1 jam lalu',
    syncCountToday: 7
  },
  {
    id: 'srv-wa',
    category: 'messaging',
    providerName: 'WhatsApp Business Cloud API',
    serviceTitle: 'WhatsApp Official Broadcaster',
    description: 'Kirim pengingat iuran otomatis & kode otentikasi 2FA via WhatsApp.',
    iconName: 'chat',
    isConnected: false,
    environment: 'sandbox',
    apiKey: '',
    secretKey: '',
    merchantOrListId: '',
    lastPingStatus: 'pending',
    lastPingLatencyMs: 0,
    lastSyncedAt: 'Belum terhubung',
    syncCountToday: 0
  }
];

export const INITIAL_WEBHOOKS: WebhookConfig[] = [
  {
    id: 'wh-001',
    name: 'Bot Notifikasi Telegram Komunitas',
    targetUrl: 'https://api.telegram.org/bot-token-demo/sendMessage',
    events: ['member.registered', 'dues.paid'],
    secretKey: 'sec_wh_tele_99a8b7',
    isActive: true,
    lastTriggeredAt: '2026-09-16T08:00:00Z',
    lastStatus: 'success'
  }
];
