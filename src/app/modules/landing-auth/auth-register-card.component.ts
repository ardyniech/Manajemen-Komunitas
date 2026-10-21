import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { registerUser } from '../../core/auth/auth.service';

@Component({
  selector: 'app-auth-register-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-lg space-y-5 max-w-lg w-full mx-auto">
      <div class="text-center space-y-1">
        <h2 class="text-lg font-bold text-slate-900">Pendaftaran Anggota Baru</h2>
        <p class="text-xs text-slate-500">Dapatkan KTA Digital dan akses penuh ke ekosistem komunitas</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="reg-name" class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
            <input id="reg-name" type="text" formControlName="fullName" placeholder="misal: Budi Santoso" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
          <div>
            <label for="reg-email" class="block text-xs font-semibold text-slate-700 mb-1">Email Aktif *</label>
            <input id="reg-email" type="email" formControlName="email" placeholder="budi@email.com" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="reg-phone" class="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
            <input id="reg-phone" type="tel" formControlName="phone" placeholder="0812xxxxxxxx" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
          <div>
            <label for="reg-chapter" class="block text-xs font-semibold text-slate-700 mb-1">Wilayah / Chapter</label>
            <select id="reg-chapter" formControlName="chapter" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50">
              <option value="Jabodetabek & Banten">Jabodetabek & Banten</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Jawa Tengah & DIY">Jawa Tengah & DIY</option>
              <option value="Jawa Timur & Bali">Jawa Timur & Bali</option>
              <option value="Luar Pulau Jawa">Luar Pulau Jawa</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="reg-tier" class="block text-xs font-semibold text-slate-700 mb-1">Jenis Keanggotaan</label>
            <select id="reg-tier" formControlName="tier" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50">
              <option value="reguler">Reguler</option>
              <option value="vip">VIP / Prioritas</option>
              <option value="alumni">Alumni / Simpatisan</option>
            </select>
          </div>
          <div>
            <label for="reg-password" class="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi *</label>
            <input id="reg-password" type="password" formControlName="password" placeholder="Min. 6 karakter" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
        </div>

        <div>
          <label for="reg-bio" class="block text-xs font-semibold text-slate-700 mb-1">Minat & Keahlian Singkat</label>
          <input id="reg-bio" type="text" formControlName="bio" placeholder="misal: Desain Grafis, Penggiat Lingkungan, Pecinta Otomotif" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
        </div>

        <button type="submit" [disabled]="form.invalid || isSubmitting()" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
          <mat-icon class="text-sm">how_to_reg</mat-icon>
          <span>{{ isSubmitting() ? 'Mendaftarkan...' : 'Selesaikan Pendaftaran & Terbitkan KTA' }}</span>
        </button>
      </form>

      <div class="text-center pt-1 border-t border-slate-100">
        <button type="button" (click)="switchToLogin.emit()" class="text-xs text-slate-500 hover:text-indigo-600">
          Sudah punya akun? <span class="font-bold text-indigo-600 underline">Masuk di sini</span>
        </button>
      </div>
    </div>
  `
})
export class AuthRegisterCardComponent {
  registerSuccess = output<void>();
  switchToLogin = output<void>();
  isSubmitting = signal(false);

  form = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(9)]),
    chapter: new FormControl('Jabodetabek & Banten'),
    tier: new FormControl<'reguler' | 'vip' | 'alumni'>('reguler'),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    bio: new FormControl('')
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    const val = this.form.value;
    setTimeout(() => {
      registerUser({
        fullName: val.fullName ?? '',
        email: val.email ?? '',
        phone: val.phone ?? '',
        chapter: val.chapter ?? 'Jabodetabek & Banten',
        tier: val.tier ?? 'reguler',
        bio: val.bio ?? ''
      });
      this.isSubmitting.set(false);
      this.registerSuccess.emit();
    }, 300);
  }
}
