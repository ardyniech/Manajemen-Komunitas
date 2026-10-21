import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DivisionMatchDatum } from './division-match-data';

@Component({
  selector: 'app-division-chart-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 shadow-xl text-xs space-y-2.5 max-w-sm w-full pointer-events-none transition-all duration-200 select-none animate-in fade-in zoom-in-95">
      <!-- Tooltip Header -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full shrink-0 shadow-xs" [style.background-color]="datum().color"></span>
          <span class="font-bold text-slate-900 text-xs">{{ datum().label }}</span>
        </div>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/80">
          {{ datum().readinessLabel }}
        </span>
      </div>

      <!-- Core Metrics Row -->
      <div class="grid grid-cols-2 gap-2 bg-slate-50/90 p-2.5 rounded-xl border border-slate-100">
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">Rata-Rata Kecocokan</span>
          <span class="text-base font-black text-slate-800">{{ datum().avgScore }}%</span>
          <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div class="h-full rounded-full transition-all duration-300" [style.width.%]="datum().avgScore" [style.background-color]="datum().color"></div>
          </div>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">Kandidat Terpetakan</span>
          <span class="text-base font-black text-slate-800">{{ datum().count }} <span class="text-xs font-semibold text-slate-500">Anggota</span></span>
          <span class="text-[10px] text-slate-500 block mt-0.5">{{ datum().percentOfTotal }}% dari total organisasi</span>
        </div>
      </div>

      <!-- Division Character & Focus Area -->
      <div class="space-y-1 text-[11px]">
        <div class="flex items-start gap-1.5 text-slate-600">
          <mat-icon class="text-xs text-indigo-600 shrink-0 mt-0.5">psychology</mat-icon>
          <span class="leading-snug"><strong class="text-slate-800">Karakter Dominan:</strong> {{ datum().trait }}</span>
        </div>
        <div class="flex items-start gap-1.5 text-slate-600">
          <mat-icon class="text-xs text-amber-600 shrink-0 mt-0.5">flag</mat-icon>
          <span class="leading-snug"><strong class="text-slate-800">Fokus Divisi:</strong> {{ datum().focusArea }}</span>
        </div>
      </div>

      <!-- Sample Candidates -->
      @if (datum().candidateNames.length > 0) {
        <div class="pt-1.5 border-t border-slate-100">
          <span class="text-[10px] font-bold text-slate-500 block mb-1">Rekomendasi Anggota Teratas:</span>
          <div class="flex flex-wrap gap-1">
            @for (name of datum().candidateNames; track name) {
              <span class="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200/60">
                {{ name }}
              </span>
            }
          </div>
        </div>
      }

      <div class="pt-1 text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
        <mat-icon class="text-xs">touch_app</mat-icon>
        <span>Klik untuk memfilter tabel pengawasan ke divisi ini</span>
      </div>
    </div>
  `
})
export class DivisionChartTooltipComponent {
  datum = input.required<DivisionMatchDatum>();
}
