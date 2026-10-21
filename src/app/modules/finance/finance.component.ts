import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { transactionsState, persistAll } from '../../shared/utils/storage';
import { FinanceSummaryComponent } from './finance-summary.component';
import { FinanceTableComponent } from './finance-table.component';
import { exportFinancePDF, exportToExcel } from '../../shared/utils/export-engine';
import { navigateTo } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-finance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, FinanceSummaryComponent, FinanceTableComponent],
  template: `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Kas & Pembukuan Komunitas</h2>
          <p class="text-xs text-slate-500">Transparansi arus kas, iuran anggota, dan pencatatan biaya kegiatan.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" (click)="goToReports()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50">
            <mat-icon class="text-base">analytics</mat-icon> Laporan Kas
          </button>
          <button type="button" (click)="goToRecap()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100">
            <mat-icon class="text-base">chat</mat-icon> Rekap Kas WA
          </button>
          <button type="button" (click)="goToReceipts()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50">
            <mat-icon class="text-base">receipt_long</mat-icon> Kuitansi Resmi
          </button>
          <button type="button" (click)="goToQris()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100">
            <mat-icon class="text-base">qr_code_2</mat-icon> QRIS Cepat
          </button>
          <button type="button" (click)="goToEntry()" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800">
            <mat-icon class="text-base">add_circle_outline</mat-icon> Catat Transaksi
          </button>
        </div>
      </div>

      <app-finance-summary [balance]="totalBalance()" [income]="totalIncome()" [expense]="totalExpense()" />

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <app-finance-table
          [transactions]="transactionsState()"
          (viewReceipt)="goToReceipts()"
          (transactionDeleted)="deleteTx($event)"
        />
      </div>
    </div>
  `
})
export class FinanceComponent {
  transactionsState = transactionsState;

  totalIncome = computed(() => transactionsState().filter(t => t.type !== 'pengeluaran').reduce((s, t) => s + t.amount, 0));
  totalExpense = computed(() => transactionsState().filter(t => t.type === 'pengeluaran').reduce((s, t) => s + t.amount, 0));
  totalBalance = computed(() => this.totalIncome() - this.totalExpense());

  goToEntry(): void { navigateTo('finance-entry'); }
  goToQris(): void { navigateTo('finance-qris'); }
  goToReceipts(): void { navigateTo('finance-receipts'); }
  goToReports(): void { navigateTo('finance-reports'); }
  goToRecap(): void { navigateTo('member-dues-recap'); }

  deleteTx(id: string): void {
    transactionsState.update(list => list.filter(t => t.id !== id));
    persistAll();
  }

  exportPDF(): void { exportFinancePDF('Laporan Kas Komunitas', transactionsState(), this.totalIncome(), this.totalExpense()); }
  exportExcel(): void {
    const data = transactionsState().map(t => ({ 'No. Transaksi': t.transactionNumber, 'Tanggal': t.date, 'Judul': t.title, 'Kategori': t.category, 'Metode': t.method, 'Tipe': t.type, 'Nominal (Rp)': t.amount, 'Status': t.status }));
    exportToExcel('laporan_kas_keuangan', data);
  }
}

