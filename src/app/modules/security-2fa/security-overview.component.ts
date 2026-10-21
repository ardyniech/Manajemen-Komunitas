import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SecurityStatus } from '../../shared/models/common.model';
import { AppBadge } from '../../shared/atoms/badge.component';

@Component({
  selector: 'app-security-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppBadge],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 2FA Card -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <mat-icon>phonelink_lock</mat-icon>
            </div>
            <app-badge [variant]="status().twoFactorEnabled ? 'success' : 'neutral'">
              {{ status().twoFactorEnabled ? '2FA AKTIF' : '2FA NONAKTIF' }}
            </app-badge>
          </div>
          <h3 class="font-bold text-slate-900 text-sm mb-1">Otentikasi Dua Faktor (2FA TOTP)</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Melindungi login administrator dengan kode sandi satu kali dari Google Authenticator atau Authy.
          </p>
        </div>
        <div class="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400 font-mono">Kunci: {{ status().twoFactorSecret }}</span>
          <button
            type="button"
            (click)="toggle2FA.emit(!status().twoFactorEnabled)"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {{ status().twoFactorEnabled ? 'Nonaktifkan' : 'Aktifkan 2FA' }}
          </button>
        </div>
      </div>

      <!-- E2EE Card -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <mat-icon>enhanced_encryption</mat-icon>
            </div>
            <app-badge [variant]="status().e2eeEnabled ? 'success' : 'neutral'">
              {{ status().e2eeEnabled ? 'E2EE AKTIF' : 'E2EE NONAKTIF' }}
            </app-badge>
          </div>
          <h3 class="font-bold text-slate-900 text-sm mb-1">Enkripsi End-to-End (AES-GCM 256)</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Semua pesan forum dan arsip dokumen dienkripsi di peramban klien sebelum disimpan secara lokal.
          </p>
        </div>
        <div class="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400 font-mono">Status: WebCrypto AES-GCM</span>
          <button
            type="button"
            (click)="toggleE2EE.emit(!status().e2eeEnabled)"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {{ status().e2eeEnabled ? 'Matikan E2EE' : 'Nyalakan E2EE' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class SecurityOverviewComponent {
  status = input.required<SecurityStatus>();
  toggle2FA = output<boolean>();
  toggleE2EE = output<boolean>();
}
