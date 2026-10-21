import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FinanceTransaction } from '../../shared/models/finance.model';
import { AppBadge } from '../../shared/atoms/badge.component';

@Component({
  selector: 'app-finance-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppBadge],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600">
        <thead class="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/70">
          <tr>
            <th class="py-3 px-4">No. Transaksi</th>
            <th class="py-3 px-4">Tanggal</th>
            <th class="py-3 px-4">Deskripsi / Judul</th>
            <th class="py-3 px-4">Kategori & Metode</th>
            <th class="py-3 px-4 text-right">Nominal</th>
            <th class="py-3 px-4 text-center">Status</th>
            <th class="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          @for (tx of transactions(); track tx.id) {
            <tr class="hover:bg-slate-50/50 transition-colors">
              <td class="py-3 px-4 font-mono font-medium text-slate-900">{{ tx.transactionNumber }}</td>
              <td class="py-3 px-4 text-slate-500 whitespace-nowrap">{{ tx.date }}</td>
              <td class="py-3 px-4">
                <p class="font-semibold text-slate-900">{{ tx.title }}</p>
                @if (tx.memberName) {
                  <p class="text-[11px] text-slate-400">Pembayar: {{ tx.memberName }}</p>
                }
              </td>
              <td class="py-3 px-4">
                <span class="text-slate-700 font-medium block">{{ tx.category }}</span>
                <span class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{{ tx.method }}</span>
              </td>
              <td class="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                <span [class]="tx.type === 'pengeluaran' ? 'text-rose-600' : 'text-emerald-600'">
                  {{ tx.type === 'pengeluaran' ? '-' : '+' }} Rp {{ tx.amount.toLocaleString('id-ID') }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                @if (tx.status === 'lunas') {
                  <app-badge variant="success">LUNAS</app-badge>
                } @else if (tx.status === 'menunggu') {
                  <app-badge variant="warning">MENUNGGU</app-badge>
                } @else {
                  <app-badge variant="danger">BATAL</app-badge>
                }
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    (click)="viewReceipt.emit(tx)"
                    title="Lihat Kuitansi Resmi"
                    class="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                  >
                    <mat-icon class="text-base">receipt_long</mat-icon>
                  </button>
                  <button
                    type="button"
                    (click)="transactionDeleted.emit(tx.id)"
                    title="Hapus Transaksi"
                    class="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <mat-icon class="text-base">delete_outline</mat-icon>
                  </button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="7" class="py-8 text-center text-slate-400">
                Belum ada catatan transaksi keuangan.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class FinanceTableComponent {
  transactions = input.required<FinanceTransaction[]>();
  transactionDeleted = output<string>();
  viewReceipt = output<FinanceTransaction>();
}
