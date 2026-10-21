import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TalentAnalyticsSummary } from './talent-analytics-service';

@Component({
  selector: 'app-talent-distribution-charts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- Zodiac Element Distribution -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <mat-icon class="text-indigo-600 text-base">pie_chart</mat-icon>
            <span>Distribusi Elemen Astrologi & Zodiak</span>
          </h3>
          <span class="text-[10px] text-slate-400 font-mono">Real-time</span>
        </div>

        <div class="space-y-3">
          @for (e of summary().zodiacElementBreakdown; track e.element) {
            <div class="space-y-1">
              <div class="flex justify-between text-xs font-semibold text-slate-700">
                <span>{{ e.element }}</span>
                <span class="text-slate-500">{{ e.count }} Anggota ({{ e.percentage }}%)</span>
              </div>
              <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div [class]="e.colorClass" [style.width.%]="e.percentage" class="h-full rounded-full transition-all duration-500"></div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Work Style Distribution -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <mat-icon class="text-purple-600 text-base">bar_chart</mat-icon>
            <span>Distribusi Gaya Kerja Dominan</span>
          </h3>
          <span class="text-[10px] text-slate-400 font-mono">5 Profil</span>
        </div>

        <div class="space-y-2.5">
          @for (s of summary().workStyleBreakdown; track s.style) {
            <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span class="font-bold text-slate-800 capitalize">{{ formatStyle(s.style) }}</span>
              <span class="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg font-bold font-mono text-[11px]">
                {{ s.count }} Pengurus
              </span>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class TalentDistributionChartsComponent {
  summary = input.required<TalentAnalyticsSummary>();

  formatStyle(style: string): string {
    switch (style) {
      case 'visioner': return 'Visioner (Perencana Strategis)';
      case 'analitis': return 'Analitis (Pembukuan & Detail)';
      case 'eksekutor': return 'Eksekutor (Tanggap Lapangan)';
      case 'diplomat': return 'Diplomat (Humas & Negosiasi)';
      case 'pelindung_nilai': return 'Pelindung Nilai (Dewan Etik)';
      default: return style;
    }
  }
}
