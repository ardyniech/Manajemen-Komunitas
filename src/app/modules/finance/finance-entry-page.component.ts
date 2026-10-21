import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { transactionsState, membersState, persistAll } from '../../shared/utils/storage';
import { FinanceTransaction } from '../../shared/models/finance.model';
import { navigateTo } from '../../core/navigation/navigation.service';
import { dispatcher } from '../../core/dispatcher';

@Component({
  selector: 'app-finance-entry-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-3xl mx-auto">
      <div class="flex items-center gap-3">
        <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <mat-icon class="text-base">arrow_back</mat-icon>
        </button>
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Catat Transaksi Kas & Iuran Baru</h2>
          <p class="text-xs text-slate-500">Buku kas otomatis mengkalkulasi saldo dan menerbitkan kuitansi digital.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center gap-4 p-1 bg-slate-100 rounded-xl max-w-xs">
          <button type="button" (click)="setType('in')" [class]="form.value.type === 'in' ? 'bg-white font-bold text-emerald-600 shadow-2xs' : 'text-slate-500'" class="flex-1 py-1.5 text-xs rounded-lg transition-all text-center">
            Pemasukan / Iuran
          </button>
          <button type="button" (click)="setType('out')" [class]="form.value.type === 'out' ? 'bg-white font-bold text-rose-600 shadow-2xs' : 'text-slate-500'" class="flex-1 py-1.5 text-xs rounded-lg transition-all text-center">
            Pengeluaran Kas
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="tx-title" class="block text-xs font-semibold text-slate-700 mb-1">Judul / Keterangan Transaksi *</label>
            <input id="tx-title" formControlName="title" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="e.g. Iuran Bulanan / Beli Perlengkapan" />
          </div>
          <div>
            <label for="tx-amount" class="block text-xs font-semibold text-slate-700 mb-1">Nominal (Rp) *</label>
            <input id="tx-amount" formControlName="amount" type="number" min="1000" step="1000" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold" />
          </div>
          <div>
            <label for="tx-category" class="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
            <select id="tx-category" formControlName="category" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
              <option value="iuran_wajib">Iuran Wajib Anggota</option>
              <option value="iuran_sukarela">Donasi / Sukarela</option>
              <option value="operasional">Operasional & Kesekretariatan</option>
              <option value="kegiatan">Kegiatan & Acara</option>
              <option value="perlengkapan">Aset & Perlengkapan</option>
            </select>
          </div>
          <div>
            <label for="tx-method" class="block text-xs font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
            <select id="tx-method" formControlName="paymentMethod" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
              <option value="transfer_bank">Transfer Bank</option>
              <option value="qris">QRIS Standar</option>
              <option value="tunai">Tunai / Kas Langsung</option>
            </select>
          </div>
        </div>

        <div>
          <label for="tx-member" class="block text-xs font-semibold text-slate-700 mb-1">Terkait Anggota (Opsional)</label>
          <select id="tx-member" formControlName="memberId" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
            <option value="">-- Tidak Terikat Anggota Tertentu --</option>
            @for (m of members(); track m.id) {
              <option [value]="m.id">{{ m.fullName }} ({{ m.memberNumber }})</option>
            }
          </select>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" (click)="goBack()" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">Batal</button>
          <button type="submit" [disabled]="form.invalid" class="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">Bukukan Transaksi</button>
        </div>
      </form>
    </div>
  `
})
export class FinanceEntryPageComponent {
  members = membersState;
  form = new FormGroup({
    type: new FormControl<'in' | 'out'>('in', Validators.required),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    amount: new FormControl(50000, [Validators.required, Validators.min(1000)]),
    category: new FormControl('iuran_wajib', Validators.required),
    paymentMethod: new FormControl<'transfer_bank' | 'qris' | 'tunai'>('transfer_bank', Validators.required),
    memberId: new FormControl('')
  });

  setType(t: 'in' | 'out'): void { this.form.patchValue({ type: t }); }
  goBack(): void { navigateTo('finance'); }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const selectedMem = this.members().find(m => m.id === v.memberId);
    const newTx: FinanceTransaction = {
      id: `tx-${Date.now()}`,
      transactionNumber: `INV-${Date.now().toString().slice(-6)}`,
      type: v.type === 'in' ? 'iuran' : 'pengeluaran',
      title: v.title ?? '',
      amount: Number(v.amount ?? 0),
      category: v.category ?? 'iuran_wajib',
      method: (v.paymentMethod as 'transfer_bank' | 'qris' | 'tunai') ?? 'transfer_bank',
      date: new Date().toISOString().split('T')[0],
      memberId: v.memberId || undefined,
      memberName: selectedMem?.fullName,
      status: 'lunas'
    };

    transactionsState.update(list => [newTx, ...list]);
    persistAll();
    dispatcher.emit(v.type === 'in' ? 'DUES_RECORDED' : 'EXPENSE_RECORDED', newTx, 'finance');
    navigateTo('finance');
  }
}
