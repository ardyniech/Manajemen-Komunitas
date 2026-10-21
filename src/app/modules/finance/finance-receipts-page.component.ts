import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { transactionsState, settingsState, membersState } from '../../shared/utils/storage';
import { navigateTo } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-finance-receipts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
            <mat-icon class="text-base">arrow_back</mat-icon>
          </button>
          <div>
            <h2 class="text-lg font-bold text-slate-900 tracking-tight">Kuitansi Pembayaran Digital Resmi</h2>
            <p class="text-xs text-slate-500">Bukti sah penerimaan dana kas dengan nomor seri dan stempel terverifikasi.</p>
          </div>
        </div>
        <button type="button" (click)="printReceipt()" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 inline-flex items-center gap-1.5">
          <mat-icon class="text-base">print</mat-icon> Cetak Kuitansi
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Sidebar Daftar Transaksi -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <span class="text-xs font-bold text-slate-700 block mb-2">Pilih Transaksi:</span>
          <div class="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
            @for (tx of transactions(); track tx.id) {
              <button
                type="button"
                (click)="selectedTxId.set(tx.id)"
                [class]="selectedTxId() === tx.id ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'"
                class="w-full text-left p-2.5 rounded-xl border transition-all text-xs"
              >
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold truncate">{{ tx.title }}</span>
                  <span class="text-[10px] font-mono text-slate-400">{{ tx.date }}</span>
                </div>
                <div class="flex justify-between items-center text-[11px]">
                  <span class="font-mono font-bold" [class]="tx.type === 'iuran' || tx.type === 'pemasukan_lain' ? 'text-emerald-600' : 'text-rose-600'">
                    {{ tx.type === 'pengeluaran' ? '-' : '+' }}Rp {{ tx.amount.toLocaleString('id-ID') }}
                  </span>
                  <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">{{ tx.method }}</span>
                </div>
              </button>
            }
          </div>
        </div>

        <!-- Pratinjau Kuitansi Siap Cetak -->
        <div class="md:col-span-2 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs relative print:shadow-none print:border-none">
          @if (currentTx(); as t) {
            <div class="space-y-6">
              <div class="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h3 class="text-base font-black text-slate-900 tracking-tight uppercase">{{ settings().communityName }}</h3>
                  <p class="text-[11px] text-slate-500">Kuitansi Tanda Terima Kas Resmi</p>
                </div>
                <div class="text-right">
                  <span class="text-xs font-mono font-bold text-slate-700">NO: {{ t.transactionNumber || t.id }}</span>
                  <p class="text-[10px] text-slate-400">Tanggal: {{ t.date }}</p>
                </div>
              </div>

              <div class="space-y-3 text-xs">
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span class="text-slate-500">Telah Terima Dari:</span>
                  <span class="font-bold text-slate-800">{{ getMemberName(t.memberId) }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span class="text-slate-500">Untuk Pembayaran:</span>
                  <span class="font-bold text-slate-800">{{ t.title }}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-100">
                  <span class="text-slate-500">Metode Penyaluran:</span>
                  <span class="font-bold uppercase text-slate-800">{{ t.method }}</span>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl flex justify-between items-center mt-4">
                  <span class="text-xs text-slate-600 font-semibold">Total Nominal:</span>
                  <span class="text-lg font-black font-mono text-slate-900">Rp {{ t.amount.toLocaleString('id-ID') }}</span>
                </div>
              </div>

              <div class="pt-6 flex justify-between items-end text-center">
                <div class="inline-block p-2 border-2 border-emerald-600/40 rounded-xl text-emerald-600 text-[10px] font-bold uppercase tracking-widest rotate-[-5deg]">
                  LUNAS / VERIFIED
                </div>
                <div>
                  <p class="text-[11px] text-slate-600 font-semibold">Bendahara Keuangan</p>
                  <p class="text-xs font-bold text-slate-900 mt-8 underline">{{ settings().bankAccountHolder || 'Pengurus Komunitas' }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class FinanceReceiptsPageComponent {
  transactions = transactionsState;
  settings = settingsState;
  members = membersState;
  selectedTxId = signal<string>(transactionsState()[0]?.id || '');

  currentTx = computed(() => this.transactions().find(t => t.id === this.selectedTxId()) || this.transactions()[0]);

  getMemberName(memberId?: string): string {
    if (!memberId) return 'Kas Umum Komunitas';
    const m = this.members().find(item => item.id === memberId);
    return m ? `${m.fullName} (${m.memberNumber})` : 'Anggota Terdaftar';
  }

  goBack(): void { navigateTo('finance'); }
  printReceipt(): void { window.print(); }
}
