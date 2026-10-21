import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TalentAnalyticsSummary } from './talent-analytics-service';

@Component({
  selector: 'app-dewan-etik-stat-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
          <mat-icon class="text-xl">psychology</mat-icon>
        </span>
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Terasesmen</span>
          <span class="text-lg font-black text-slate-900">{{ summary().totalProfiles }} Anggota</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
          <mat-icon class="text-xl">stars</mat-icon>
        </span>
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Rata-Rata Fit Score</span>
          <span class="text-lg font-black text-emerald-700">{{ summary().averageFitScore }}% Match</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
          <mat-icon class="text-xl">verified</mat-icon>
        </span>
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Kesiapan Tinggi (&ge;90%)</span>
          <span class="text-lg font-black text-slate-900">{{ summary().highReadinessCount }} Kandidat</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
          <mat-icon class="text-xl">flare</mat-icon>
        </span>
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Elemen Dominan</span>
          <span class="text-lg font-black text-slate-900">Elemen {{ summary().dominantElement }}</span>
        </div>
      </div>
    </div>
  `
})
export class DewanEtikStatCardsComponent {
  summary = input.required<TalentAnalyticsSummary>();
}
