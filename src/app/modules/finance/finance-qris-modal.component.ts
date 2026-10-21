import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppModal } from '../../shared/atoms/modal.component';
import { settingsState } from '../../shared/utils/storage';

@Component({
  selector: 'app-finance-qris-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppModal],
  template: `
    <app-modal [isOpen]="isOpen()" title="Pembayaran Digital QRIS" subtitle="Pindai kode QRIS standar Bank Indonesia / ASPI" (dismiss)="modalClose.emit()">
      <div class="space-y-4 text-center">
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block w-full">
          <div class="flex items-center justify-between mb-3 px-2">
            <span class="text-xs font-bold text-slate-700 tracking-wider">QRIS STANDAR</span>
            <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">NMID: ID1020304050</span>
          </div>

          <!-- Dynamic QR Graphic Frame -->
          <div class="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-inner">
            <svg class="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="none">
              <!-- Corner Finder Patterns -->
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
              <rect x="13" y="13" width="10" height="10" rx="1" fill="#0f172a" />

              <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
              <rect x="77" y="13" width="10" height="10" rx="1" fill="#0f172a" />

              <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
              <rect x="13" y="77" width="10" height="10" rx="1" fill="#0f172a" />

              <!-- Data Pixels Pattern -->
              <rect x="36" y="8" width="6" height="6" fill="#4f46e5" />
              <rect x="46" y="16" width="6" height="6" fill="#0f172a" />
              <rect x="56" y="8" width="6" height="6" fill="#0f172a" />
              <rect x="40" y="30" width="8" height="8" fill="#4f46e5" />
              <rect x="52" y="30" width="6" height="6" fill="#0f172a" />
              <rect x="8" y="40" width="6" height="6" fill="#0f172a" />
              <rect x="18" y="48" width="6" height="6" fill="#4f46e5" />
              <rect x="38" y="44" width="24" height="24" rx="4" fill="#6366f1" />
              <rect x="70" y="42" width="6" height="6" fill="#0f172a" />
              <rect x="82" y="52" width="6" height="6" fill="#4f46e5" />
              <rect x="40" y="74" width="8" height="8" fill="#0f172a" />
              <rect x="54" y="80" width="6" height="6" fill="#4f46e5" />
              <rect x="68" y="72" width="6" height="6" fill="#0f172a" />
              <rect x="80" y="82" width="6" height="6" fill="#0f172a" />
            </svg>
            <p class="text-[10px] text-slate-400 font-mono mt-2">Dukungan: GoPay, OVO, Dana, BCA, Mandiri, BRI, BSI</p>
          </div>

          <div class="mt-3">
            <p class="text-xs text-slate-500">Merchant: <strong class="text-slate-800">{{ settings().communityName }}</strong></p>
            <p class="text-xs text-slate-500">Nominal Default Iuran: <strong class="text-slate-900 font-mono">Rp {{ settings().monthlyDuesNominal.toLocaleString('id-ID') }}</strong></p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            (click)="simulatePayment()"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5"
          >
            <mat-icon class="text-sm">check_circle</mat-icon> Simulasi Bayar Berhasil
          </button>
          <button
            type="button"
            (click)="modalClose.emit()"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </app-modal>
  `
})
export class FinanceQrisModalComponent {
  isOpen = input.required<boolean>();
  modalClose = output<void>();
  paymentSuccess = output<void>();
  settings = settingsState;

  simulatePayment(): void {
    this.paymentSuccess.emit();
    this.modalClose.emit();
  }
}
