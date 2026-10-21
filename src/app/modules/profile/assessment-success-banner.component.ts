import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberPersonalTalent } from '../../shared/models/personality-talent.model';

@Component({
  selector: 'app-assessment-success-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-2xl p-5 text-white shadow-lg space-y-4 border border-indigo-500/30">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div class="flex items-center gap-2.5">
          <span class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <mat-icon class="text-xl">verified</mat-icon>
          </span>
          <div>
            <h4 class="text-sm font-bold text-white tracking-tight">Kalkulasi Backend Selesai (+50 XP)</h4>
            <p class="text-[11px] text-indigo-200">Data kepribadian Anda telah tersimpan dan terenkripsi untuk Dewan Etik.</p>
          </div>
        </div>
        <button type="button" (click)="recalculate.emit()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1 self-start sm:self-auto">
          <mat-icon class="text-sm">refresh</mat-icon>
          <span>Hitung Ulang</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
          <span class="text-amber-400 font-bold block flex items-center gap-1 text-[11px]"><mat-icon class="text-sm">flare</mat-icon> Weton & Primbon</span>
          <p class="font-bold text-white">{{ talent().weton.wetonFull }} (Neptu {{ talent().weton.neptu }})</p>
          <p class="text-[10px] text-slate-300">{{ talent().weton.watakUtama }}</p>
        </div>

        <div class="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
          <span class="text-sky-400 font-bold block flex items-center gap-1 text-[11px]"><mat-icon class="text-sm">wb_twilight</mat-icon> Astrologi & Elemen</span>
          <p class="font-bold text-white">{{ talent().astrology.zodiacSign }} ({{ talent().astrology.element }})</p>
          <p class="text-[10px] text-slate-300">{{ talent().astrology.sifatKepemimpinan }}</p>
        </div>

        <div class="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
          <span class="text-purple-400 font-bold block flex items-center gap-1 text-[11px]"><mat-icon class="text-sm">auto_awesome</mat-icon> Shio & Wuxing</span>
          <p class="font-bold text-white">Shio {{ talent().astrology.shio }} ({{ talent().astrology.shioElement }})</p>
          <p class="text-[10px] text-slate-300">Gaya: {{ talent().workStyle }}</p>
        </div>
      </div>
    </div>
  `
})
export class AssessmentSuccessBannerComponent {
  talent = input.required<MemberPersonalTalent>();
  recalculate = output<void>();
}
