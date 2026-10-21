import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-charts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Pertumbuhan Anggota Bulanan -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Tren Pertumbuhan Anggota (2026)</h3>
        <div class="space-y-3 text-xs">
          @for (m of monthlyGrowth(); track m.month) {
            <div>
              <div class="flex justify-between text-slate-600 mb-1">
                <span>{{ m.month }}</span>
                <span class="font-semibold text-slate-900">{{ m.count }} Anggota</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" [style.width.%]="m.percentage"></div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Kategori Pengeluaran Kas -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Distribusi Alokasi Kas</h3>
        <div class="space-y-3 text-xs">
          <div>
            <div class="flex justify-between text-slate-600 mb-1">
              <span>Kegiatan & Workshop Komunitas</span>
              <span class="font-semibold text-slate-900">45%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-emerald-500 h-2.5 rounded-full" style="width: 45%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-slate-600 mb-1">
              <span>Operasional Cloud, Server & Domain</span>
              <span class="font-semibold text-slate-900">30%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-blue-500 h-2.5 rounded-full" style="width: 30%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-slate-600 mb-1">
              <span>Konsumsi Temu Darat & Merchandise</span>
              <span class="font-semibold text-slate-900">25%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-amber-500 h-2.5 rounded-full" style="width: 25%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsChartsComponent {
  monthlyGrowth = input.required<{ month: string; count: number; percentage: number }[]>();
}
