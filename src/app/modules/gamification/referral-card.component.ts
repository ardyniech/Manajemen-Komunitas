import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { currentUser } from '../../core/auth/auth.service';
import { simulateReferral } from '../../core/gamification/gamification.service';

@Component({
  selector: 'app-referral-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-slate-50 rounded-2xl p-5 border border-indigo-100/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-5">
      <div class="space-y-1.5 max-w-lg">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <mat-icon class="text-base">card_giftcard</mat-icon>
          </span>
          <h3 class="font-bold text-sm text-slate-900">Ajak Teman & Raih +100 Poin XP</h3>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          Bagikan tautan pendaftaran unik Anda kepada rekan kerja atau komunitas lain. Dapatkan 100 poin XP saat mereka berhasil terdaftar.
        </p>

        <!-- Referral Link Input -->
        <div class="flex items-center gap-2 pt-2">
          <div class="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700 font-mono select-all flex-1 truncate">
            {{ referralLink() }}
          </div>
          <button
            type="button"
            (click)="onCopyLink()"
            class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0"
          >
            <mat-icon class="text-sm">{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
            <span>{{ copied() ? 'Tersalin!' : 'Salin' }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Action Simulate -->
      <div class="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shrink-0 w-full md:w-auto">
        <span class="block text-[11px] text-slate-500 mb-2">Simulasi Pengujian:</span>
        <button
          type="button"
          (click)="onSimulateInvite()"
          class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <mat-icon class="text-sm">person_add</mat-icon>
          <span>Simulasi Rekan Daftar (+100 XP)</span>
        </button>
      </div>
    </div>
  `
})
export class ReferralCardComponent {
  user = currentUser;
  copied = signal<boolean>(false);

  referralLink(): string {
    return `https://komunika.id/join?ref=${this.user().memberNumber}`;
  }

  onCopyLink(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.referralLink());
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  onSimulateInvite(): void {
    simulateReferral('Rekan Baru');
  }
}
