import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WebhookConfig } from '../../shared/models/integration.model';

@Component({
  selector: 'app-webhook-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Integrasi API & Webhooks Pihak Ketiga</h3>
          <p class="text-xs text-slate-500">Hubungkan bot Telegram, Discord, atau payment gateway eksternal.</p>
        </div>
        <span class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">REST & Webhook</span>
      </div>

      <div class="space-y-3">
        @for (wh of webhooks(); track wh.id) {
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-slate-900">{{ wh.name }}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">AKTIF</span>
              </div>
              <p class="text-slate-500 font-mono text-[11px] truncate max-w-md">{{ wh.targetUrl }}</p>
              <p class="text-slate-400 text-[10px] mt-0.5">Events: {{ wh.events.join(', ') }}</p>
            </div>
            <button
              type="button"
              (click)="testPing.emit(wh.id)"
              class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <mat-icon class="text-sm">bolt</mat-icon> Tes Kirim Sinyal
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class WebhookPanelComponent {
  webhooks = input.required<WebhookConfig[]>();
  testPing = output<string>();
}
