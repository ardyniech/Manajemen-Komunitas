import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-api-sandbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-5 max-w-4xl mx-auto">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Interactive REST API Live Sandbox</h2>
          <p class="text-xs text-slate-500">Kirim panggilan HTTP langsung ke endpoint Express server secara real-time.</p>
        </div>
        <button type="button" [disabled]="isLoading()" (click)="executeRequest()" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 inline-flex items-center gap-1.5 disabled:opacity-50">
          <mat-icon class="text-base">{{ isLoading() ? 'hourglass_empty' : 'play_arrow' }}</mat-icon>
          <span>{{ isLoading() ? 'Mengirim...' : 'Kirim Request' }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div class="sm:col-span-1">
          <label for="sb-method" class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Method</label>
          <select id="sb-method" [value]="selectedMethod()" (change)="selectedMethod.set($any($event.target).value)" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
        <div class="sm:col-span-3">
          <label for="sb-endpoint" class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Endpoint Path</label>
          <select id="sb-endpoint" [value]="selectedEndpoint()" (change)="selectedEndpoint.set($any($event.target).value)" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono">
            <option value="/api/members">/api/members</option>
            <option value="/api/events">/api/events</option>
            <option value="/api/payments">/api/payments</option>
          </select>
        </div>
      </div>

      @if (lastResponse()) {
        <div class="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 text-slate-100 p-4 font-mono text-xs space-y-2">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
            <span [class]="lastStatus() >= 200 && lastStatus() < 300 ? 'text-emerald-400' : 'text-rose-400'" class="font-bold">HTTP {{ lastStatus() }} • {{ latencyMs() }}ms</span>
            <span class="text-[10px] text-slate-400">Content-Type: application/json</span>
          </div>
          <pre class="overflow-x-auto text-[11px] text-emerald-400 leading-relaxed max-h-72">{{ lastResponse() }}</pre>
        </div>
      }
    </div>
  `
})
export class ApiSandboxComponent {
  selectedMethod = signal<'GET' | 'POST'>('GET');
  selectedEndpoint = signal('/api/members');
  isLoading = signal(false);
  lastStatus = signal(200);
  latencyMs = signal(0);
  lastResponse = signal<string | null>(null);

  async executeRequest(): Promise<void> {
    this.isLoading.set(true);
    const start = performance.now();
    try {
      const url = this.selectedEndpoint();
      const method = this.selectedMethod();
      let init: RequestInit = { method };
      if (method === 'POST') {
        init = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(url === '/api/members' ? { fullName: 'Demo Sandbox', email: 'demo@komunika.id' } : { amount: 50000 })
        };
      }
      const res = await fetch(url, init);
      const json = await res.json();
      this.latencyMs.set(Math.round(performance.now() - start));
      this.lastStatus.set(res.status);
      this.lastResponse.set(JSON.stringify(json, null, 2));
    } catch (err: unknown) {
      this.latencyMs.set(Math.round(performance.now() - start));
      this.lastStatus.set(500);
      this.lastResponse.set(JSON.stringify({ error: String(err) }, null, 2));
    } finally {
      this.isLoading.set(false);
    }
  }
}
