import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '../../shared/models/member.model';
import { FinanceTransaction, PaymentMethod } from '../../shared/models/finance.model';
import { membersState, transactionsState, persistAll } from '../../shared/utils/storage';
import { dispatcher } from '../../core/dispatcher';
import { awardPoints } from '../../core/gamification/gamification.service';

@Component({
  selector: 'app-member-dues-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200/80 shadow-xl space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <mat-icon class="text-lg">payments</mat-icon>
            </span>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Perpanjang Iuran Kas (+50 XP)</h3>
              <p class="text-[11px] text-slate-500">{{ member().fullName }} ({{ member().memberNumber }})</p>
            </div>
          </div>
          <button type="button" (click)="closeModal.emit()" class="text-slate-400 hover:text-slate-600"><mat-icon class="text-lg">close</mat-icon></button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <span class="block text-slate-600 font-semibold mb-1">Status Terakhir</span>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 flex justify-between items-center">
              <span>{{ member().notes || 'Belum ada catatan iuran' }}</span>
              <span class="font-mono text-[11px] text-slate-500">s/d {{ member().duesPaidUntil }}</span>
            </div>
          </div>

          <div>
            <span class="block text-slate-600 font-semibold mb-1">Pilihan Durasi Perpanjangan</span>
            <div class="grid grid-cols-3 gap-2">
              @for (opt of durationOptions; track opt.months) {
                <button type="button" (click)="selectedMonths.set(opt.months)" [class]="selectedMonths() === opt.months ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'" class="py-2 px-1 text-center rounded-xl transition-colors">
                  <div class="text-[11px]">{{ opt.months }} Bulan</div>
                  <div class="text-[10px] opacity-80">Rp {{ opt.amount.toLocaleString('id-ID') }}</div>
                </button>
              }
            </div>
          </div>

          <div>
            <span class="block text-slate-600 font-semibold mb-1">Metode Pembayaran</span>
            <div class="grid grid-cols-3 gap-2">
              @for (m of paymentMethods; track m.id) {
                <button type="button" (click)="selectedMethod.set(m.id)" [class]="selectedMethod() === m.id ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 font-semibold' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'" class="py-1.5 px-2 border rounded-xl text-center text-[11px]">
                  {{ m.label }}
                </button>
              }
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" (click)="closeModal.emit()" class="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">Batal</button>
          <button type="button" (click)="confirmPayment()" class="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800">Simpan & Verifikasi Kas</button>
        </div>
      </div>
    </div>
  `
})
export class MemberDuesModalComponent {
  member = input.required<Member>();
  closeModal = output<void>();
  paymentSuccess = output<void>();
  selectedMonths = signal<number>(1);
  selectedMethod = signal<PaymentMethod>('qris');

  readonly durationOptions = [{ months: 1, amount: 50000 }, { months: 3, amount: 150000 }, { months: 6, amount: 300000 }];
  readonly paymentMethods: { id: PaymentMethod; label: string }[] = [{ id: 'qris', label: 'QRIS' }, { id: 'transfer_bank', label: 'Transfer' }, { id: 'tunai', label: 'Tunai' }];

  confirmPayment(): void {
    const mem = this.member();
    const months = this.selectedMonths();
    const dateStr = new Date().toISOString().split('T')[0];
    const target = new Date();
    target.setMonth(target.getMonth() + months);
    const newEnd = target.toISOString().split('T')[0];

    const newTx: FinanceTransaction = {
      id: `tx-dues-${Date.now()}`,
      transactionNumber: `TRX-${Date.now().toString().slice(-6)}`,
      date: dateStr,
      type: 'iuran',
      category: 'Iuran Bulanan Anggota',
      title: `Iuran Kas ${months} Bulan - ${mem.fullName}`,
      amount: months * 50000,
      memberId: mem.id,
      memberName: mem.fullName,
      status: 'lunas',
      method: this.selectedMethod(),
      notes: `Perpanjangan iuran kas ${months} bulan via ${this.selectedMethod()}`
    };

    transactionsState.update(list => [newTx, ...list]);
    membersState.update(list => list.map(m => m.id === mem.id ? { ...m, status: 'aktif', duesPaidUntil: newEnd, notes: `Iuran terbayar s/d ${newEnd}` } : m));
    persistAll();
    awardPoints(mem.id, 50, 'Pembayaran Iuran Kas Tepat Waktu', 'dues_paid');
    dispatcher.emit('FINANCE_TRANSACTION_CREATED', newTx, 'finance');
    this.paymentSuccess.emit();
    this.closeModal.emit();
  }
}
