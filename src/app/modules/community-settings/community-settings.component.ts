import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { settingsState, persistAll } from '../../shared/utils/storage';
import { dispatcher } from '../../core/dispatcher';

@Component({
  selector: 'app-community-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-4xl">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight">Pengaturan Komunitas</h2>
        <p class="text-xs text-slate-500">Profil resmi paguyuban/organisasi, rekening kas, dan nominal iuran.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="saveSettings()" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div class="space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Identitas & Kontak Komunitas</h3>
          <div>
            <label for="set-comm-name" class="block text-xs font-semibold text-slate-700 mb-1">Nama Komunitas *</label>
            <input id="set-comm-name" formControlName="communityName" type="text" class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200" />
          </div>
          <div>
            <label for="set-comm-tagline" class="block text-xs font-semibold text-slate-700 mb-1">Slogan / Tagline</label>
            <input id="set-comm-tagline" formControlName="tagline" type="text" class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label for="set-comm-email" class="block text-xs font-semibold text-slate-700 mb-1">Email Sekretariat</label>
              <input id="set-comm-email" formControlName="contactEmail" type="email" class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200" />
            </div>
            <div>
              <label for="set-comm-phone" class="block text-xs font-semibold text-slate-700 mb-1">No. Kontak / Hotline</label>
              <input id="set-comm-phone" formControlName="contactPhone" type="text" class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200" />
            </div>
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-slate-100">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Konfigurasi Kas & Rekening Iuran</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label for="set-dues-nominal" class="block text-xs font-semibold text-slate-700 mb-1">Nominal Iuran Bulanan Standar (Rp)</label>
              <input id="set-dues-nominal" formControlName="monthlyDuesNominal" type="number" step="5000" class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-mono" />
            </div>
            <div>
              <label for="set-bank-name" class="block text-xs font-semibold text-slate-700 mb-1">Nama Bank / Dompet Digital</label>
              <input id="set-bank-name" formControlName="bankName" type="text" class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label for="set-bank-account-num" class="block text-xs font-semibold text-slate-700 mb-1">Nomor Rekening / Virtual Account</label>
              <input id="set-bank-account-num" formControlName="bankAccountNumber" type="text" class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-mono" />
            </div>
            <div>
              <label for="set-bank-account-holder" class="block text-xs font-semibold text-slate-700 mb-1">Atas Nama Rekening</label>
              <input id="set-bank-account-holder" formControlName="bankAccountHolder" type="text" class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200" />
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
          @if (savedSuccess()) {
            <span class="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1">
              <mat-icon class="text-sm">check_circle</mat-icon> Pengaturan berhasil diperbarui!
            </span>
          } @else {
            <span></span>
          }
          <button type="submit" [disabled]="form.invalid" class="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  `
})
export class CommunitySettingsComponent {
  savedSuccess = signal(false);

  form = new FormGroup({
    communityName: new FormControl(settingsState().communityName, [Validators.required]),
    tagline: new FormControl(settingsState().tagline),
    contactEmail: new FormControl(settingsState().contactEmail, [Validators.required, Validators.email]),
    contactPhone: new FormControl(settingsState().contactPhone),
    monthlyDuesNominal: new FormControl(settingsState().monthlyDuesNominal, [Validators.required, Validators.min(0)]),
    bankName: new FormControl(settingsState().bankName),
    bankAccountNumber: new FormControl(settingsState().bankAccountNumber),
    bankAccountHolder: new FormControl(settingsState().bankAccountHolder)
  });

  saveSettings(): void {
    if (this.form.invalid) return;
    const val = this.form.value;
    settingsState.update(curr => ({
      ...curr,
      communityName: val.communityName ?? curr.communityName,
      tagline: val.tagline ?? curr.tagline,
      contactEmail: val.contactEmail ?? curr.contactEmail,
      contactPhone: val.contactPhone ?? curr.contactPhone,
      monthlyDuesNominal: val.monthlyDuesNominal ?? curr.monthlyDuesNominal,
      bankName: val.bankName ?? curr.bankName,
      bankAccountNumber: val.bankAccountNumber ?? curr.bankAccountNumber,
      bankAccountHolder: val.bankAccountHolder ?? curr.bankAccountHolder
    }));
    persistAll();
    dispatcher.emit('NOTIFICATION_PUSHED', { title: 'Pengaturan Disimpan', message: 'Profil komunitas berhasil diperbarui.' }, 'settings');
    this.savedSuccess.set(true);
    setTimeout(() => this.savedSuccess.set(false), 3000);
  }
}
