import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { dewanEtikLogsState, EthicalLogType, LOG_TYPE_META } from './dewan-etik-log-service';
import { exportLogsToCsv } from './dewan-etik-export-util';

@Component({
  selector: 'app-dewan-etik-activity-log',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3.5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <mat-icon class="text-base">history_edu</mat-icon>
          </span>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-slate-900 tracking-tight">Log Transparansi Perubahan Formasi & Etik</h3>
              <span class="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">Audit Trail</span>
            </div>
            <p class="text-[11px] text-slate-500">Pencatatan real-time audit pergeseran posisi, telaah integritas, dan klirens.</p>
          </div>
        </div>
        <button type="button" (click)="exportCsv()" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs flex items-center gap-1 self-start sm:self-auto">
          <mat-icon class="text-xs text-amber-400">download</mat-icon><span>Ekspor CSV</span>
        </button>
      </div>

      <!-- Search & Category Filter Row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div class="relative flex-1 max-w-sm">
          <mat-icon class="absolute left-2.5 top-2 text-slate-400 text-sm">search</mat-icon>
          <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Cari nama, KTA, aktor, catatan..." class="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500" />
        </div>

        <div class="flex items-center gap-1 overflow-x-auto pb-0.5">
          <button type="button" (click)="selectedType.set('all')" [class]="selectedType() === 'all' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600'" class="px-2.5 py-1 rounded-lg transition-colors shrink-0">Semua ({{ logs().length }})</button>
          <button type="button" (click)="selectedType.set('manual_override')" [class]="selectedType() === 'manual_override' ? 'bg-indigo-700 text-white font-bold' : 'bg-slate-100 text-slate-600'" class="px-2 py-1 rounded-lg transition-colors shrink-0 flex items-center gap-1"><mat-icon class="text-xs">swap_horiz</mat-icon><span>Manual</span></button>
          <button type="button" (click)="selectedType.set('clearance_issued')" [class]="selectedType() === 'clearance_issued' ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-100 text-slate-600'" class="px-2 py-1 rounded-lg transition-colors shrink-0 flex items-center gap-1"><mat-icon class="text-xs">verified</mat-icon><span>Klirens</span></button>
          <button type="button" (click)="selectedType.set('smart_match_applied')" [class]="selectedType() === 'smart_match_applied' ? 'bg-purple-700 text-white font-bold' : 'bg-slate-100 text-slate-600'" class="px-2 py-1 rounded-lg transition-colors shrink-0 flex items-center gap-1"><mat-icon class="text-xs">auto_awesome</mat-icon><span>Triad</span></button>
        </div>
      </div>

      <!-- Log Entries Timeline -->
      <div class="divide-y divide-slate-100">
        @for (item of filteredLogs(); track item.id) {
          <div class="py-3 flex flex-col md:flex-row md:items-start justify-between gap-2.5 text-xs">
            <div class="flex items-start gap-2.5 min-w-0">
              <span [class]="meta[item.type].badgeClass" class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5"><mat-icon class="text-sm">{{ meta[item.type].icon }}</mat-icon></span>
              <div class="space-y-1 min-w-0">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="font-bold text-slate-900 text-xs">{{ item.targetMemberName }}</span>
                  <span class="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{{ item.targetMemberNumber }}</span>
                  <span [class]="meta[item.type].tagClass" class="text-[10px] font-bold px-1.5 py-0.5 rounded">{{ item.typeLabel }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-700 font-medium">
                  @if (item.previousPlacement && item.previousPlacement !== item.newPlacement) {
                    <span class="line-through text-slate-400">{{ item.previousPlacement }}</span>
                    <mat-icon class="text-xs text-indigo-600">arrow_forward</mat-icon>
                  }
                  <span class="font-bold text-indigo-900">{{ item.newPlacement }}</span>
                </div>
                <p class="text-[11px] text-slate-600 bg-slate-50/80 p-2 rounded-xl border border-slate-100/90 leading-relaxed font-sans">"{{ item.notes }}"</p>
              </div>
            </div>
            <div class="shrink-0 text-left md:text-right pl-9 md:pl-0 space-y-0.5">
              <span class="text-[10px] text-slate-400 block font-mono">{{ item.timestamp }}</span>
              <span class="text-[11px] text-slate-700 font-semibold block">Oleh: {{ item.actorName }}</span>
              <span class="text-[10px] text-slate-500 block">{{ item.actorRole }}</span>
            </div>
          </div>
        } @empty {
          <div class="py-8 text-center text-slate-400 text-xs space-y-1">
            <mat-icon class="text-2xl text-slate-300">receipt_long</mat-icon>
            <p>Tidak ada riwayat log yang sesuai dengan filter atau pencarian.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class DewanEtikActivityLogComponent {
  logs = dewanEtikLogsState;
  selectedType = signal<'all' | EthicalLogType>('all');
  searchQuery = signal<string>('');
  readonly meta = LOG_TYPE_META;

  filteredLogs = computed(() => {
    const list = this.logs();
    const type = this.selectedType();
    const q = this.searchQuery().toLowerCase().trim();
    return list.filter(l => (type === 'all' || l.type === type) &&
      (!q || (l.targetMemberName + l.targetMemberNumber + l.actorName + l.notes).toLowerCase().includes(q))
    );
  });

  exportCsv(): void { exportLogsToCsv(this.filteredLogs()); }
}
