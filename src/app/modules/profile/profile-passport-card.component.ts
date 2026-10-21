import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthUser } from '../../shared/models/auth.model';
import { settingsState } from '../../shared/utils/storage';

@Component({
  selector: 'app-profile-passport-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-slate-900">Paspor Digital Keanggotaan (KTA)</h3>
          <p class="text-xs text-slate-500">Gunakan kartu ini untuk absensi acara resmi dan verifikasi keaktifan</p>
        </div>
        <button type="button" (click)="printCard()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1">
          <mat-icon class="text-sm">print</mat-icon>
          <span>Cetak KTA</span>
        </button>
      </div>

      <!-- High-Fidelity Holographic Card -->
      <div class="max-w-md mx-auto rounded-3xl p-6 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden space-y-6">
        <!-- Top Card Row -->
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <mat-icon class="text-base text-white">hub</mat-icon>
            </div>
            <div>
              <span class="text-[10px] font-mono text-indigo-300 uppercase tracking-widest block">{{ settings().communityName }}</span>
              <span class="text-xs font-bold text-white">PASPOR ANGGOTA</span>
            </div>
          </div>
          <span class="px-2 py-0.5 text-[9px] font-bold rounded-md bg-amber-400 text-slate-950 uppercase font-mono">{{ user().tier }}</span>
        </div>

        <!-- Middle Card Row: Avatar & Identity -->
        <div class="flex items-center gap-4 relative z-10">
          <img [src]="user().avatarUrl" class="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/50" alt="Foto" referrerpolicy="no-referrer" />
          <div class="space-y-0.5 min-w-0">
            <h4 class="text-base font-bold text-white truncate">{{ user().fullName }}</h4>
            <p class="text-xs text-indigo-200 font-mono tracking-wider">{{ user().memberNumber }}</p>
            <p class="text-[10px] text-slate-400 truncate">{{ user().roleTitle }} • {{ user().chapter || 'Nasional' }}</p>
          </div>
        </div>

        <!-- Bottom Card Row: QR & Dues Validity -->
        <div class="flex items-end justify-between pt-4 border-t border-indigo-900/60 relative z-10 text-[10px]">
          <div>
            <span class="text-slate-400 block">Iuran Aktif Hingga:</span>
            <span class="font-bold text-emerald-400 font-mono">{{ user().duesPaidUntil }}</span>
          </div>

          <!-- Simulated QR Code -->
          <div class="p-1.5 bg-white rounded-xl shadow-xs">
            <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=KOMUNIKA:' + user().memberNumber" class="w-10 h-10 object-contain" alt="QR" />
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfilePassportCardComponent {
  user = input.required<AuthUser>();
  settings = settingsState;

  printCard(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
