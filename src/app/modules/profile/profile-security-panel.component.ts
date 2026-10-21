import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthUser } from '../../shared/models/auth.model';
import { activeSessions, updateAuthProfile } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile-security-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-5">
      <!-- 2FA Toggle Card -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <mat-icon>security</mat-icon>
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Otentikasi Dua Faktor (2FA)</h3>
              <p class="text-xs text-slate-500">Amankan akun dengan verifikasi TOTP Google Authenticator</p>
            </div>
          </div>
          <button type="button" (click)="toggle2FA()" [class]="user().twoFactorActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'" class="px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5">
            <mat-icon class="text-sm">{{ user().twoFactorActive ? 'check_circle' : 'toggle_off' }}</mat-icon>
            <span>{{ user().twoFactorActive ? '2FA Aktif' : 'Aktifkan 2FA' }}</span>
          </button>
        </div>
      </div>

      <!-- Password Change Card -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-sm font-bold text-slate-900">Perbarui Kata Sandi</h3>
          @if (passSuccess()) {
            <span class="text-xs font-bold text-emerald-600 flex items-center gap-1"><mat-icon class="text-sm">done</mat-icon> Kata sandi diperbarui</span>
          }
        </div>

        <form [formGroup]="passForm" (ngSubmit)="onPasswordChange()" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="prof-curr-pass" class="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
            <input id="prof-curr-pass" type="password" formControlName="currentPass" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
          <div>
            <label for="prof-new-pass" class="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
            <input id="prof-new-pass" type="password" formControlName="newPass" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
          <div class="sm:col-span-2 flex justify-end">
            <button type="submit" [disabled]="passForm.invalid" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50">Perbarui Kata Sandi</button>
          </div>
        </form>
      </div>

      <!-- Active Sessions List -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
        <h3 class="text-sm font-bold text-slate-900">Sesi Login Aktif ({{ sessions().length }})</h3>
        <div class="space-y-2">
          @for (s of sessions(); track s.token) {
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <div class="flex items-center gap-3">
                <mat-icon class="text-slate-400">devices</mat-icon>
                <div>
                  <p class="font-bold text-slate-900">{{ s.device }}</p>
                  <p class="text-[11px] text-slate-500 font-mono">{{ s.ipAddress }} • {{ s.loginAt }}</p>
                </div>
              </div>
              <button type="button" (click)="revokeSession(s.token)" class="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-100">Cabut Sesi</button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ProfileSecurityPanelComponent {
  user = input.required<AuthUser>();
  sessions = activeSessions;
  passSuccess = signal(false);

  passForm = new FormGroup({
    currentPass: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPass: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  toggle2FA(): void {
    updateAuthProfile({ twoFactorActive: !this.user().twoFactorActive });
  }

  onPasswordChange(): void {
    if (this.passForm.invalid) return;
    this.passSuccess.set(true);
    this.passForm.reset();
    setTimeout(() => this.passSuccess.set(false), 3000);
  }

  revokeSession(token: string): void {
    this.sessions.update(list => list.filter(s => s.token !== token));
  }
}
