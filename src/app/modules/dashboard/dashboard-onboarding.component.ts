import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { membersState, transactionsState, topicsState } from '../../shared/utils/storage';
import { navigateTo } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-dashboard-onboarding',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
            Lv.{{ onboarding().level }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-900 text-sm tracking-tight">{{ onboarding().levelTitle }}</h3>
              <span class="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">Just-in-Time Onboarding</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">{{ onboarding().description }}</p>
          </div>
        </div>

        <button
          type="button"
          (click)="onboarding().action()"
          class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
        >
          <mat-icon class="text-base">{{ onboarding().actionIcon }}</mat-icon>
          <span>{{ onboarding().actionText }}</span>
        </button>
      </div>

      <!-- Progressive Progress Bar -->
      <div>
        <div class="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
          <span>Progres Kesiapan Komunitas</span>
          <span class="font-bold text-slate-900">{{ onboarding().percentage }}% Selesai</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="bg-indigo-600 h-full transition-all duration-500 rounded-full" [style.width.%]="onboarding().percentage"></div>
        </div>
      </div>
    </div>
  `
})
export class DashboardOnboardingComponent {
  members = membersState;
  transactions = transactionsState;
  topics = topicsState;

  onboarding = computed(() => {
    const mCount = this.members().length;
    const txCount = this.transactions().length;
    const topCount = this.topics().length;

    if (mCount === 0) {
      return {
        level: 1,
        levelTitle: 'Tahap 1: Daftarkan Anggota Perdana',
        description: 'Mulai bangun basis data keanggotaan untuk mengaktifkan kartu tanda anggota & absensi.',
        actionText: 'Daftarkan Anggota Pertama',
        actionIcon: 'person_add',
        action: () => navigateTo('member-register'),
        percentage: 15
      };
    }

    if (txCount === 0) {
      return {
        level: 2,
        levelTitle: 'Tahap 2: Aktifkan Pembukuan Kas',
        description: 'Anggota sudah terdaftar. Sekarang catat saldo kas awal atau iuran pertama komunitas.',
        actionText: 'Catat Kas / Iuran Baru',
        actionIcon: 'account_balance_wallet',
        action: () => navigateTo('finance-entry'),
        percentage: 50
      };
    }

    if (topCount === 0) {
      return {
        level: 2,
        levelTitle: 'Tahap 2: Mulai Forum Musyawarah',
        description: 'Buka ruang diskusi komunitas terenkripsi E2EE untuk mengumpulkan aspirasi anggota.',
        actionText: 'Tulis Topik Perdana',
        actionIcon: 'forum',
        action: () => navigateTo('forum-new'),
        percentage: 75
      };
    }

    return {
      level: 3,
      levelTitle: 'Tahap 3: Komunitas Aktif & Terkelola Penuh',
      description: 'Seluruh instrumen keanggotaan, kas, kuitansi digital, dan forum berjalan optimal.',
      actionText: 'Lihat Analitik Pertumbuhan',
      actionIcon: 'insights',
      action: () => navigateTo('analytics'),
      percentage: 100
    };
  });
}
