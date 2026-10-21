import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TalentAnalyticsSummary } from './talent-analytics-service';

@Component({
  selector: 'app-division-readiness-heatmap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <mat-icon class="text-amber-500 text-base">grid_view</mat-icon>
            <span>Heatmap Kesiapan Formasi Kepengurusan Dewan Etik</span>
          </h3>
          <p class="text-[11px] text-slate-500">Ketersediaan kandidat dan rerata skor kecocokan karakter per bidang</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        @for (d of summary().divisionDistribution; track d.division) {
          <div class="p-3.5 rounded-2xl border transition-all space-y-2 bg-slate-50 border-slate-200/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-900">{{ d.label }}</span>
              <span [class]="d.avgScore >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'" class="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                {{ d.avgScore }}% Match
              </span>
            </div>

            <div class="flex items-baseline justify-between pt-1">
              <span class="text-xs text-slate-500">Pool Kandidat:</span>
              <span class="text-sm font-black text-slate-900">{{ d.count }} Anggota</span>
            </div>

            <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div [style.width.%]="d.avgScore" [class]="d.avgScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'" class="h-full rounded-full"></div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DivisionReadinessHeatmapComponent {
  summary = input.required<TalentAnalyticsSummary>();
}
