import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { membersState, transactionsState, persistAll, settingsState } from '../../shared/utils/storage';
import { navigateTo } from '../../core/navigation/navigation.service';
import { dispatcher } from '../../core/dispatcher';
import { FinanceTransaction } from '../../shared/models/finance.model';

@Component({
  selector: 'app-finance-qris-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-2xl mx-auto">
      <div class="flex items-center gap-3">
        <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <mat-icon class="text-base">arrow_back</mat-icon>
        </button>
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Gerbang Pembayaran QRIS Komunitas</h2>
          <p class="text-xs text-slate-500">Standar QRIS Bank Indonesia & ASPI untuk penerimaan iuran instan.</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-5">
        <!-- Logo QRIS & Badge Standar -->
        <div class="w-full flex justify-between items-center px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
          <span class="font-black tracking-widest text-slate-900 text-sm">QRIS</span>
          <span class="text-[10px] text-slate-500 font-semibold uppercase">NMID: ID1020304050607</span>
        </div>

        <!-- Dynamic QR Display Container -->
        <div class="p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-sm inline-block">
          <div class="w-52 h-52 bg-slate-900 text-white flex flex-col items-center justify-center rounded-xl p-4 relative">
            <mat-icon class="text-7xl text-white">qr_code_2</mat-icon>
            <span class="text-[10px] tracking-wider font-mono mt-1 text-slate-300">{{ settings().communityName }}</span>
          </div>
        </div>

        <div class="w-full space-y-3 text-left">
          <div>
            <label for="qris-member-select" class="block text-xs font-semibold text-slate-700 mb-1">Pilih Anggota Penyetor</label>
            <select id="qris-member-select" [value]="selectedMemberId()" (change)="selectedMemberId.set($any($event.target).value)" class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white">
              @for (m of members(); track m.id) {
                <option [value]="m.id">{{ m.fullName }} ({{ m.memberNumber }})</option>
              }
            </select>
          </div>

          <div>
            <label for="qris-amount-select" class="block text-xs font-semibold text-slate-700 mb-1">Pilihan Nominal Iuran</label>
            <div id="qris-amount-select" class="grid grid-cols-3 gap-2">
              @for (nominal of [25000, 50000, 100000]; track nominal) {
                <button type="button" (click)="selectedAmount.set(nominal)" [class]="selectedAmount() === nominal ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-700'" class="py-2 text-xs rounded-xl transition-all">
                  Rp {{ nominal.toLocaleString('id-ID') }}
                </button>
              }
            </div>
          </div>
        </div>

        <button type="button" (click)="simulatePayment()" class="w-full py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-2">
          <mat-icon class="text-base">check_circle</mat-icon> Simulasi Konfirmasi Pembayaran Berhasil
        </button>
      </div>
    </div>
  `
})
export class FinanceQrisPageComponent {
  members = membersState;
  settings = settingsState;
  selectedMemberId = signal<string>(membersState()[0]?.id || '');
  selectedAmount = signal<number>(50000);

  goBack(): void { navigateTo('finance'); }

  simulatePayment(): void {
    const mem = this.members().find(m => m.id === this.selectedMemberId());
    const newTx: FinanceTransaction = {
      id: `tx-qris-${Date.now()}`,
      transactionNumber: `QRIS-${Date.now().toString().slice(-6)}`,
      type: 'iuran',
      title: `Iuran QRIS - ${mem?.fullName || 'Anggota'}`,
      amount: this.selectedAmount(),
      category: 'iuran_wajib',
      method: 'qris',
      date: new Date().toISOString().split('T')[0],
      memberId: this.selectedMemberId(),
      memberName: mem?.fullName,
      status: 'lunas'
    };

    transactionsState.update(curr => [newTx, ...curr]);
    persistAll();
    dispatcher.emit('DUES_RECORDED', newTx, 'finance-qris');
    navigateTo('finance-receipts');
  }
}
