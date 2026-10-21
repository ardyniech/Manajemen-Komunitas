import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApiDocsPanelComponent } from './api-docs-panel.component';
import { WebhookPanelComponent } from './webhook-panel.component';
import { webhooksState } from '../../shared/utils/storage';
import { dispatcher } from '../../core/dispatcher';

@Component({
  selector: 'app-api-docs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, ApiDocsPanelComponent, WebhookPanelComponent],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight">Dokumentasi REST API & Webhooks</h2>
        <p class="text-xs text-slate-500">Spesifikasi OpenAPI/Swagger interaktif dan pengelolaan payload event webhook.</p>
      </div>

      <app-api-docs-panel />

      <app-webhook-panel
        [webhooks]="webhooksState()"
        (testPing)="testPingWebhook($event)"
      />
    </div>
  `
})
export class ApiDocsPageComponent {
  webhooksState = webhooksState;

  testPingWebhook(id: string): void {
    webhooksState.update(list =>
      list.map(w => (w.id === id ? { ...w, lastTriggeredAt: new Date().toISOString(), lastStatus: 'success' } : w))
    );
    dispatcher.emit('NOTIFICATION_PUSHED', { title: 'Webhook Ping Terkirim', message: 'Sinyal payload HTTP 200 OK' }, 'integrations');
  }
}
