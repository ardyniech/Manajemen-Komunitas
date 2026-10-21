import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { membersState, transactionsState, topicsState } from '../../shared/utils/storage';
import { AppStatCard } from '../../shared/atoms/stat-card.component';
import { AnalyticsChartsComponent } from './analytics-charts.component';
import { exportToExcel } from '../../shared/utils/export-engine';

@Component({
  selector: 'app-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppStatCard, AnalyticsChartsComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Dasbor Analitik Komunitas</h2>
          <p class="text-xs text-slate-500">Statistik pertumbuhan anggota, rasio iuran kas, dan engagement forum.</p>
        </div>
        <button
          type="button"
          (click)="exportMetrics()"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
        >
          <mat-icon class="text-base">download</mat-icon> Ekspor Matriks
        </button>
      </div>

      <!-- Overview Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card label="Tingkat Retensi" value="94.2%" icon="loyalty" subtext="anggota aktif > 6 bulan" tone="indigo" />
        <app-stat-card label="Rasio Pembayaran" [value]="collectionRate() + '%'" icon="paid" subtext="iuran tepat waktu" tone="emerald" />
        <app-stat-card label="Rata-rata Diskusi" value="4.8" icon="question_answer" subtext="komentar per topik" tone="amber" />
        <app-stat-card label="Kecepatan Kas" value="100%" icon="speed" subtext="pencatatan real-time" tone="slate" />
      </div>

      <!-- Charts Section -->
      <app-analytics-charts [monthlyGrowth]="growthData()" />
    </div>
  `
})
export class AnalyticsComponent {
  totalMembers = computed(() => membersState().length);

  collectionRate = computed(() => {
    const total = membersState().length;
    if (total === 0) return 0;
    const paid = membersState().filter(m => m.status === 'aktif').length;
    return Math.round((paid / total) * 100);
  });

  growthData = computed(() => [
    { month: 'Januari', count: 45, percentage: 45 },
    { month: 'Maret', count: 68, percentage: 68 },
    { month: 'Juni', count: 82, percentage: 82 },
    { month: 'September', count: this.totalMembers(), percentage: 95 }
  ]);

  exportMetrics(): void {
    const rows = [
      { Metrik: 'Total Anggota', Nilai: this.totalMembers() },
      { Metrik: 'Rasio Kepatuhan Iuran', Nilai: `${this.collectionRate()}%` },
      { Metrik: 'Total Topik Forum', Nilai: topicsState().length },
      { Metrik: 'Total Transaksi Kas', Nilai: transactionsState().length }
    ];
    exportToExcel('laporan_analitik_komunitas', rows);
  }
}
