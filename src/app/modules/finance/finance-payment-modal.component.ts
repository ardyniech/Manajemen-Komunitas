import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppModal } from '../../shared/atoms/modal.component';
import { FinanceTransaction, PaymentMethod, PaymentStatus } from '../../shared/models/finance.model';
import { Member } from '../../shared/models/member.model';

@Component({
  selector: 'app-finance-payment-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AppModal],
  template: `
    <app-modal [isOpen]="isOpen()" [title]="isDues() ? 'Pencatatan Iuran Anggota' : 'Pencatatan Pengeluaran Kas'" subtitle="Input transaksi keuangan kas komunitas" (dismiss)="modalClose.emit()">
      <form [formGroup]="form" class="space-y-4">
        @if (isDues()) {
          <div>
            <label for="fin-member-select" class="block text-xs font-semibold text-slate-700 mb-1">Pilih Anggota Pembayar *</label>
            <select id="fin-member-select" formControlName="memberId" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
              <option value="">-- Pilih Anggota --</option>
              @for (m of members(); track m.id) {
                <option [value]="m.id">{{ m.fullName }} ({{ m.memberNumber }})</option>
              }
            </select>
          </div>
        }

        <div>
          <label for="fin-title" class="block text-xs font-semibold text-slate-700 mb-1">Judul / Keterangan Transaksi *</label>
          <input id="fin-title" formControlName="title" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="e.g. Iuran Bulan September 2026 / Sewa Konsumsi" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="fin-amount" class="block text-xs font-semibold text-slate-700 mb-1">Nominal (Rupiah) *</label>
            <input id="fin-amount" formControlName="amount" type="number" step="5000" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" />
          </div>
          <div>
            <label for="fin-method" class="block text-xs font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
            <select id="fin-method" formControlName="method" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
              <option value="qris">QRIS Standar</option>
              <option value="transfer_bank">Transfer Bank</option>
              <option value="virtual_account">Virtual Account</option>
              <option value="tunai">Tunai / Cash</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="fin-category" class="block text-xs font-semibold text-slate-700 mb-1">Kategori Transaksi</label>
            <input id="fin-category" formControlName="category" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" />
          </div>
          <div>
            <label for="fin-status" class="block text-xs font-semibold text-slate-700 mb-1">Status Verifikasi</label>
            <select id="fin-status" formControlName="status" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
              <option value="lunas">Lunas Terverifikasi</option>
              <option value="menunggu">Menunggu Konfirmasi</option>
            </select>
          </div>
        </div>
      </form>

      <div footer class="flex items-center gap-2">
        <button type="button" (click)="modalClose.emit()" class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">Batal</button>
        <button type="button" [disabled]="form.invalid" (click)="onSubmit()" class="px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">Simpan Transaksi</button>
      </div>
    </app-modal>
  `
})
export class FinancePaymentModalComponent {
  isOpen = input.required<boolean>();
  isDues = input.required<boolean>();
  members = input.required<Member[]>();
  modalClose = output<void>();
  save = output<Partial<FinanceTransaction>>();

  form = new FormGroup({
    memberId: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    amount: new FormControl(50000, [Validators.required, Validators.min(1000)]),
    method: new FormControl<PaymentMethod>('qris', [Validators.required]),
    category: new FormControl('Iuran Bulanan Anggota'),
    status: new FormControl<PaymentStatus>('lunas', [Validators.required])
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.save.emit(this.form.value as Partial<FinanceTransaction>);
  }
}
