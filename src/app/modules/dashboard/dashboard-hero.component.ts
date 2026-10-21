import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sistem Aktif & Terlindungi E2EE
          </span>
        </div>
        <h2 class="text-xl md:text-2xl font-bold tracking-tight">Portal Manajemen Komunitas</h2>
        <p class="text-slate-300 text-xs md:text-sm mt-0.5">Pantau keanggotaan, arus kas iuran, dan forum internal secara real-time.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          (click)="triggerBackup.emit()"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors"
        >
          <mat-icon class="text-base">cloud_upload</mat-icon>
          <span>Backup Cloud</span>
        </button>
      </div>
    </div>
  `
})
export class DashboardHeroComponent {
  triggerBackup = output<void>();
}
