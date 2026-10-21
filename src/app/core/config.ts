export const APP_CONFIG = {
  appName: 'Manajemen Komunitas',
  version: '2.4.0',
  defaultCurrency: 'IDR',
  storageKeyPrefix: 'komunika_v2_',
  defaultDuesNominal: 50000,
  routes: {
    dashboard: 'dashboard',
    members: 'members',
    finance: 'finance',
    forum: 'forum',
    analytics: 'analytics',
    roles: 'roles',
    settings: 'settings',
    security: 'security',
    integrations: 'integrations'
  }
} as const;

export const DESIGN_TOKENS = {
  colors: {
    brandPrimary: '#0f172a',
    brandAccent: '#2563eb',
    brandSurface: '#f8fafc',
    brandCard: '#ffffff',
    borderSubtle: '#e2e8f0',
    success: '#059669',
    warning: '#d97706',
    danger: '#dc2626'
  },
  borderRadius: {
    card: '1.25rem',
    button: '0.75rem',
    pill: '9999px'
  }
} as const;
