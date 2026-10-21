import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { transactionsState } from '../../shared/utils/storage';
import { navigateTo } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-finance-reports-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
            <mat-icon class="text-base">arrow_back</mat-icon>
          </button>
          <div>
            <h2 class="text-lg font-bold text-slate-900 tracking-tight">Laporan & Analisis Arus Kas Komunitas</h2>
            <p class="text-xs text-slate-500">Evaluasi kesehatan finansial, rasio pengeluaran, dan tren saldo bulanan.</p>
          </div>
        </div>
        <button type="button" (click)="printReport()" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 inline-flex items-center gap-1.5">
          <mat-icon class="text-base">print</mat-icon> Cetak Laporan Kas
        </button>
      </div>

      <!-- Financial Health Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span class="text-xs text-slate-500 font-semibold block mb-1">Total Pemasukan Kas</span>
          <p class="text-xl font-bold font-mono text-emerald-600">Rp {{ stats().totalIn.toLocaleString('id-ID') }}</p>
          <span class="text-[10px] text-slate-400 mt-1 block">Dari {{ stats().countIn }} transaksi berhasil</span>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span class="text-xs text-slate-500 font-semibold block mb-1">Total Pengeluaran Kas</span>
          <p class="text-xl font-bold font-mono text-rose-600">Rp {{ stats().totalOut.toLocaleString('id-ID') }}</p>
          <span class="text-[10px] text-slate-400 mt-1 block">Dari {{ stats().countOut }} alokasi dana</span>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span class="text-xs text-slate-500 font-semibold block mb-1">Saldo Bersih / Cadangan Kas</span>
          <p class="text-xl font-bold font-mono text-slate-900">Rp {{ stats().netBalance.toLocaleString('id-ID') }}</p>
          <span class="text-[10px] text-emerald-600 font-bold mt-1 block">Status: Likuiditas Stabil</span>
        </div>
      </div>

      <!-- Breakdown Kategori Pengeluaran -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Komposisi Transaksi Kas</h3>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-slate-700">Rasio Pemasukan vs Pengeluaran</span>
              <span class="text-slate-500">{{ stats().inRatio }}% Masuk / {{ 100 - stats().inRatio }}% Keluar</span>
            </div>
            <div class="w-full h-3 bg-rose-100 rounded-full overflow-hidden flex">
              <div class="bg-emerald-500 h-full" [style.width.%]="stats().inRatio"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FinanceReportsPageComponent {
  transactions = transactionsState;

  stats = computed(() => {
    const list = this.transactions();
    let totalIn = 0;
    let totalOut = 0;
    let countIn = 0;
    let countOut = 0;

    for (const t of list) {
      if (t.type === 'iuran' || t.type === 'pemasukan_lain') {
        totalIn += t.amount;
        countIn++;
      } else {
        totalOut += t.amount;
        countOut++;
      }
    }

    const netBalance = totalIn - totalOut;
    const totalVolume = totalIn + totalOut;
    const inRatio = totalVolume > 0 ? Math.round((totalIn / totalVolume) * 100) : 100;

    return { totalIn, totalOut, countIn, countOut, netBalance, inRatio };
  });

  goBack(): void { navigateTo('finance'); }
  printReport(): void { window.print(); }
}
