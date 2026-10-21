import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FinanceTransaction } from '../../shared/models/finance.model';
import { AppModal } from '../../shared/atoms/modal.component';
import { AppBadge } from '../../shared/atoms/badge.component';
import { settingsState } from '../../shared/utils/storage';

@Component({
  selector: 'app-finance-receipt-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppModal, AppBadge],
  template: `
    @if (tx()) {
      <app-modal [isOpen]="isOpen()" title="Kuitansi Bukti Pembayaran Resmi" subtitle="Tanda terima transaksi kas terverifikasi" (dismiss)="modalClose.emit()">
        <div class="space-y-4">
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-4">
            <!-- Header Kuitansi -->
            <div class="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 class="font-bold text-sm text-slate-900">{{ settings().communityName }}</h4>
                <p class="text-[10px] text-slate-400 font-mono">NO: {{ tx()!.transactionNumber }}</p>
              </div>
              <app-badge [variant]="tx()!.status === 'lunas' ? 'success' : 'warning'">
                {{ tx()!.status | uppercase }}
              </app-badge>
            </div>

            <!-- Detail Transaksi -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-slate-400 block text-[10px]">Telah Terima Dari:</span>
                <span class="font-semibold text-slate-900">{{ tx()!.memberName || 'Kas Komunitas' }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Tanggal Transaksi:</span>
                <span class="font-semibold text-slate-900 font-mono">{{ tx()!.date }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Kategori & Metode:</span>
                <span class="font-medium text-slate-700 capitalize">{{ tx()!.category }} ({{ tx()!.method }})</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Uraian Pembayaran:</span>
                <span class="font-medium text-slate-700">{{ tx()!.title }}</span>
              </div>
            </div>

            <!-- Jumlah Nominal & Stempel -->
            <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-slate-400 uppercase font-semibold">Jumlah Terbilang:</span>
                <p class="text-base font-bold text-slate-900 font-mono">
                  Rp {{ tx()!.amount.toLocaleString('id-ID') }}
                </p>
              </div>
              <div class="px-3 py-1 rounded-lg border border-emerald-500/40 bg-emerald-50 text-emerald-700 text-center">
                <span class="text-[10px] font-bold tracking-widest uppercase block">TERVERIFIKASI</span>
                <span class="text-[8px] font-mono text-emerald-600">KOMUNIKA PAY</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              (click)="printReceipt()"
              class="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 inline-flex items-center gap-1.5"
            >
              <mat-icon class="text-sm">print</mat-icon> Cetak Kuitansi
            </button>
            <button
              type="button"
              (click)="modalClose.emit()"
              class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            >
              Tutup
            </button>
          </div>
        </div>
      </app-modal>
    }
  `
})
export class FinanceReceiptModalComponent {
  isOpen = input.required<boolean>();
  tx = input<FinanceTransaction | null>(null);
  modalClose = output<void>();
  settings = settingsState;

  printReceipt(): void {
    window.print();
  }
}
