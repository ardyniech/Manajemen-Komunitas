import { ChangeDetectionStrategy, Component, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthUser } from '../../shared/models/auth.model';
import { updateAuthProfile } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile-info-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-sm font-bold text-slate-900">Informasi Pribadi & Kontak</h3>
          <p class="text-xs text-slate-500">Perbarui data utama akun keanggotaan Anda</p>
        </div>
        @if (savedSuccess()) {
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1 animate-fade-in">
            <mat-icon class="text-sm">check_circle</mat-icon> Tersimpan
          </span>
        }
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="prof-fullname" class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input id="prof-fullname" type="text" formControlName="fullName" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
          <div>
            <label for="prof-email" class="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
            <input id="prof-email" type="email" formControlName="email" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="prof-phone" class="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
            <input id="prof-phone" type="tel" formControlName="phone" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
          <div>
            <label for="prof-address" class="block text-xs font-semibold text-slate-700 mb-1">Domisili / Kota</label>
            <input id="prof-address" type="text" formControlName="address" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
        </div>

        <div>
          <label for="prof-bio" class="block text-xs font-semibold text-slate-700 mb-1">Biografi Singkat</label>
          <textarea id="prof-bio" formControlName="bio" rows="3" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"></textarea>
        </div>

        <div class="flex justify-end pt-2">
          <button type="submit" [disabled]="form.invalid || isSaving()" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50">
            <mat-icon class="text-sm">save</mat-icon>
            <span>{{ isSaving() ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProfileInfoFormComponent {
  user = input.required<AuthUser>();
  isSaving = signal(false);
  savedSuccess = signal(false);

  form = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(9)]),
    address: new FormControl(''),
    bio: new FormControl('')
  });

  constructor() {
    effect(() => {
      const u = this.user();
      this.form.patchValue({
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        address: u.address || '',
        bio: u.bio || ''
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const val = this.form.value;
    updateAuthProfile({
      fullName: val.fullName ?? this.user().fullName,
      email: val.email ?? this.user().email,
      phone: val.phone ?? this.user().phone,
      address: val.address ?? '',
      bio: val.bio ?? ''
    });
    this.isSaving.set(false);
    this.savedSuccess.set(true);
    setTimeout(() => this.savedSuccess.set(false), 3000);
  }
}
