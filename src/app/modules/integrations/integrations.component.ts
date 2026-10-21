import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { backupsState, webhooksState, externalServicesState, membersState, transactionsState, topicsState, persistAll } from '../../shared/utils/storage';
import { BackupPanelComponent } from './backup-panel.component';
import { WebhookPanelComponent } from './webhook-panel.component';
import { ApiDocsPanelComponent } from './api-docs-panel.component';
import { ApiSandboxComponent } from './api-sandbox.component';
import { ExternalServicesPanelComponent } from './external-services-panel.component';
import { dispatcher } from '../../core/dispatcher';

@Component({
  selector: 'app-integrations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, BackupPanelComponent, WebhookPanelComponent, ApiDocsPanelComponent, ApiSandboxComponent, ExternalServicesPanelComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight">RESTful API & Integrasi Cloud</h2>
        <p class="text-xs text-slate-500">Akses API pihak ketiga, live sandbox tester, dan sinkronisasi cloud.</p>
      </div>

      <app-external-services-panel [services]="externalServicesState()" (toggleConnection)="toggleServiceConnection($event)" (testPingService)="testPingService($event)" />
      <app-api-sandbox />
      <app-api-docs-panel />
      <app-backup-panel [backups]="backupsState()" (triggerBackup)="triggerBackup()" (downloadSnapshot)="downloadSnapshot()" />
      <app-webhook-panel [webhooks]="webhooksState()" (testPing)="testPingWebhook($event)" />
    </div>
  `
})
export class IntegrationsComponent {
  backupsState = backupsState;
  webhooksState = webhooksState;
  externalServicesState = externalServicesState;

  toggleServiceConnection(id: string): void {
    externalServicesState.update(list =>
      list.map(s => s.id !== id ? s : { ...s, isConnected: !s.isConnected, lastSyncedAt: !s.isConnected ? 'Baru saja' : 'Terputus', lastPingStatus: !s.isConnected ? 'success' : 'pending' })
    );
    persistAll();
    const srv = externalServicesState().find(s => s.id === id);
    if (srv) {
      dispatcher.emit('NOTIFICATION_PUSHED', { title: srv.isConnected ? 'Layanan Terhubung' : 'Layanan Terputus', message: `${srv.providerName} kini ${srv.isConnected ? 'aktif' : 'dinonaktifkan'}.` }, 'integrations');
    }
  }

  testPingService(id: string): void {
    const latency = Math.floor(25 + Math.random() * 85);
    externalServicesState.update(list => list.map(s => s.id === id ? { ...s, lastPingStatus: 'success', lastPingLatencyMs: latency, lastSyncedAt: 'Baru saja' } : s));
    persistAll();
    const srv = externalServicesState().find(s => s.id === id);
    if (srv) {
      dispatcher.emit('NOTIFICATION_PUSHED', { title: 'Uji Ping API Berhasil', message: `Respon ${srv.providerName}: HTTP 200 OK (${latency}ms)` }, 'integrations');
    }
  }

  triggerBackup(): void {
    const newRecord = {
      id: `bk-${Date.now()}`,
      createdAt: new Date().toLocaleString('id-ID'),
      fileName: `komunika_snapshot_${Date.now()}.json`,
      sizeBytes: 154300,
      destination: 'Google Drive' as const,
      status: 'synced' as const,
      checksum: `sha256-${Math.random().toString(36).substring(2, 10)}`
    };
    backupsState.update(list => [newRecord, ...list]);
    persistAll();
    dispatcher.emit('BACKUP_TRIGGERED', newRecord, 'integrations');
  }

  downloadSnapshot(): void {
    const fullSnapshot = { version: '2.4.0', exportedAt: new Date().toISOString(), members: membersState(), transactions: transactionsState(), topics: topicsState() };
    const blob = new Blob([JSON.stringify(fullSnapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `komunika_backup_${Date.now()}.json`;
    a.click();
  }

  testPingWebhook(id: string): void {
    webhooksState.update(list => list.map(w => w.id === id ? { ...w, lastTriggeredAt: new Date().toISOString(), lastStatus: 'success' } : w));
    persistAll();
    dispatcher.emit('NOTIFICATION_PUSHED', { title: 'Webhook Ping Terkirim', message: 'Sinyal payload HTTP 200 OK' }, 'integrations');
  }
}
