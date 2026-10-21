import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { loginUser } from '../../core/auth/auth.service';

@Component({
  selector: 'app-auth-login-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-lg space-y-5 max-w-md w-full mx-auto">
      <div class="text-center space-y-1">
        <h2 class="text-lg font-bold text-slate-900">Masuk ke Komunika OS</h2>
        <p class="text-xs text-slate-500">Gunakan email terdaftar atau akun pengurus Anda</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label for="login-email" class="block text-xs font-semibold text-slate-700 mb-1">Email / ID Anggota</label>
          <div class="relative">
            <input id="login-email" type="email" formControlName="email" placeholder="nama@komunika.id" class="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-indigo-600 bg-slate-50/50" />
            <mat-icon class="absolute left-2.5 top-2.5 text-slate-400 text-lg">mail_outline</mat-icon>
          </div>
        </div>

        <div>
          <label for="login-password" class="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
          <div class="relative">
            <input id="login-password" [type]="showPassword() ? 'text' : 'password'" formControlName="password" placeholder="••••••••" class="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-indigo-600 bg-slate-50/50" />
            <mat-icon class="absolute left-2.5 top-2.5 text-slate-400 text-lg">lock_outline</mat-icon>
            <button type="button" (click)="showPassword.set(!showPassword())" class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
              <mat-icon class="text-lg">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs">
          <label class="flex items-center gap-1.5 text-slate-600 cursor-pointer">
            <input type="checkbox" formControlName="rememberMe" class="rounded text-indigo-600 focus:ring-0" />
            <span>Ingat Saya</span>
          </label>
          <button type="button" (click)="quickFill('arya.pratama@komunika.id')" class="text-indigo-600 font-semibold hover:underline">Isi Admin</button>
        </div>

        <button type="submit" [disabled]="form.invalid || isSubmitting()" class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <mat-icon class="text-sm">login</mat-icon>
          <span>{{ isSubmitting() ? 'Memverifikasi...' : 'Masuk Sekarang' }}</span>
        </button>
      </form>

      <div class="pt-3 border-t border-slate-100 space-y-2">
        <p class="text-[11px] text-slate-400 text-center font-medium">Atau pilih akun instan:</p>
        <div class="grid grid-cols-2 gap-1.5">
          <button type="button" (click)="quickLogin('arya.pratama@komunika.id')" class="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-left truncate">⚡ Super Admin</button>
          <button type="button" (click)="quickLogin('siti.rahma@gmail.com')" class="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-left truncate">⚡ Bendahara Kas</button>
          <button type="button" (click)="quickLogin('dimas.dev@yahoo.co.id')" class="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-left truncate">⚡ Ketua Komunitas</button>
          <button type="button" (click)="quickLogin('rizky.fauzi@techmail.id')" class="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-left truncate">⚡ Anggota Biasa</button>
        </div>
      </div>

      <div class="text-center pt-2">
        <button type="button" (click)="switchToRegister.emit()" class="text-xs text-slate-500 hover:text-indigo-600">
          Belum punya akun? <span class="font-bold text-indigo-600 underline">Daftar Keanggotaan</span>
        </button>
      </div>
    </div>
  `
})
export class AuthLoginCardComponent {
  loginSuccess = output<void>();
  switchToRegister = output<void>();
  showPassword = signal(false);
  isSubmitting = signal(false);

  form = new FormGroup({
    email: new FormControl('arya.pratama@komunika.id', [Validators.required, Validators.email]),
    password: new FormControl('komunika2026', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(true)
  });

  quickFill(email: string): void {
    this.form.patchValue({ email, password: 'password123' });
  }

  quickLogin(email: string): void {
    loginUser(email);
    this.loginSuccess.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    setTimeout(() => {
      loginUser(this.form.value.email ?? 'arya.pratama@komunika.id', this.form.value.password ?? '');
      this.isSubmitting.set(false);
      this.loginSuccess.emit();
    }, 300);
  }
}
