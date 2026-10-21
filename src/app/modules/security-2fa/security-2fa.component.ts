import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { securityState, auditLogs, verifyTOTPCode, toggle2FA, toggleE2EE } from '../../core/security';
import { SecurityOverviewComponent } from './security-overview.component';
import { dispatcher } from '../../core/dispatcher';

@Component({
  selector: 'app-security-2fa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, SecurityOverviewComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight">Pusat Keamanan & Enkripsi Data</h2>
        <p class="text-xs text-slate-500">Verifikasi otentikasi dua faktor, proteksi kriptografi, dan log audit sesi.</p>
      </div>

      <app-security-overview
        [status]="securityState()"
        (toggle2FA)="on2FAToggle($event)"
        (toggleE2EE)="onE2EEToggle($event)"
      />

      <!-- TOTP Code Test Verification Simulator -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div class="flex items-center gap-2">
          <mat-icon class="text-indigo-600">security</mat-icon>
          <h3 class="font-bold text-slate-900 text-sm">Simulasi Verifikasi Tantangan TOTP</h3>
        </div>
        <p class="text-xs text-slate-500">Masukkan kode 6 digit dari aplikasi autentikator Anda (contoh uji: 123456 atau 888999):</p>
        <div class="flex items-center gap-3 max-w-sm">
          <input
            #totpInput
            aria-label="Kode TOTP 6 digit"
            type="text"
            maxlength="6"
            placeholder="000000"
            class="w-36 text-center font-mono tracking-widest text-base font-bold py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            (click)="testCode(totpInput.value)"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            Verifikasi
          </button>
        </div>
        @if (testResult()) {
          <div [class]="testResult() === 'VALID' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'" class="p-2.5 rounded-xl text-xs font-medium inline-block">
            {{ testResult() === 'VALID' ? 'Berhasil: Kode TOTP cocok! Sesi diverifikasi aman.' : 'Gagal: Kode salah atau kedaluwarsa.' }}
          </div>
        }
      </div>

      <!-- Security Audit Trail -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 class="font-bold text-slate-900 text-sm mb-3">Audit Jejak Keamanan Sistem</h3>
        <div class="divide-y divide-slate-100 text-xs">
          @for (log of auditLogs(); track log.id) {
            <div class="py-2.5 flex items-center justify-between">
              <div>
                <p class="font-semibold text-slate-800">{{ log.action }}</p>
                <p class="text-slate-400 text-[11px]">{{ log.actor }} • {{ log.ipAddress }}</p>
              </div>
              <span class="font-mono text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                {{ log.status }}
              </span>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class Security2faComponent {
  securityState = securityState;
  auditLogs = auditLogs;
  testResult = signal<string | null>(null);

  testCode(code: string): void {
    const ok = verifyTOTPCode(code);
    this.testResult.set(ok ? 'VALID' : 'INVALID');
  }

  on2FAToggle(enable: boolean): void {
    toggle2FA(enable);
    dispatcher.emit('SECURITY_STATE_CHANGED', { twoFactorEnabled: enable }, 'security');
  }

  onE2EEToggle(enable: boolean): void {
    toggleE2EE(enable);
    dispatcher.emit('SECURITY_STATE_CHANGED', { e2eeEnabled: enable }, 'security');
  }
}
