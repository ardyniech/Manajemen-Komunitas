import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ExternalServiceConfig } from '../../shared/models/integration.model';

@Component({
  selector: 'app-external-services-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <mat-icon class="text-xl">hub</mat-icon>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Layanan API Pihak Ketiga (3P Integrations)</h3>
            <p class="text-xs text-slate-500">Kelola gateway pembayaran, email marketing, Google Calendar, dan bot percakapan.</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          @for (cat of categories; track cat.id) {
            <button
              type="button"
              (click)="selectedCategory.set(cat.id)"
              [class]="selectedCategory() === cat.id ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500'"
              class="px-2.5 py-1 rounded-lg transition-all"
            >
              {{ cat.label }}
            </button>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        @for (srv of filteredServices(); track srv.id) {
          <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-2xs">
                  <mat-icon class="text-lg">{{ srv.iconName }}</mat-icon>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {{ srv.providerName }}
                    <span class="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider" [class]="srv.environment === 'production' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                      {{ srv.environment }}
                    </span>
                  </h4>
                  <p class="text-[11px] text-slate-500 line-clamp-1">{{ srv.description }}</p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" [class]="srv.isConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-500 border border-slate-200'">
                <span class="w-1.5 h-1.5 rounded-full" [class]="srv.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
                {{ srv.isConnected ? 'Terhubung' : 'Terputus' }}
              </span>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
              <span class="flex items-center gap-1">
                <mat-icon class="text-xs text-slate-400">sync</mat-icon>
                Sync Hari Ini: <strong class="text-slate-700">{{ srv.syncCountToday }}x</strong>
              </span>
              @if (srv.isConnected && srv.lastPingLatencyMs) {
                <span class="text-emerald-600 font-semibold flex items-center gap-0.5">
                  <mat-icon class="text-xs">bolt</mat-icon>
                  {{ srv.lastPingLatencyMs }} ms
                </span>
              }
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  (click)="testPingService.emit(srv.id)"
                  class="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
                >
                  Uji Ping
                </button>
                <button
                  type="button"
                  (click)="toggleConnection.emit(srv.id)"
                  [class]="srv.isConnected ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'"
                  class="px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors"
                >
                  {{ srv.isConnected ? 'Putus' : 'Hubungkan' }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ExternalServicesPanelComponent {
  services = input.required<ExternalServiceConfig[]>();
  toggleConnection = output<string>();
  testPingService = output<string>();

  selectedCategory = signal<string>('all');

  categories = [
    { id: 'all', label: 'Semua' },
    { id: 'payment', label: 'Payment' },
    { id: 'email', label: 'Email' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'messaging', label: 'Messaging' }
  ];

  filteredServices(): ExternalServiceConfig[] {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.services();
    return this.services().filter(s => s.category === cat);
  }
}
