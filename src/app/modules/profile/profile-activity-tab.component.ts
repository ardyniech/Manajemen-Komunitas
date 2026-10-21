import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { gamificationState } from '../../core/gamification/gamification.service';
import { navigateTo } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-profile-activity-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-5">
      <div class="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            Level {{ state().currentLevel }} • {{ state().levelName }}
          </span>
          <div class="flex items-baseline gap-2 mt-2">
            <span class="text-3xl font-black">{{ state().totalPoints }}</span>
            <span class="text-xs text-slate-300">XP Poin Kontribusi</span>
          </div>
        </div>

        <button
          type="button"
          (click)="goToGamification()"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <mat-icon class="text-sm">stars</mat-icon>
          <span>Pusat Misi & Poin XP</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 class="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <mat-icon class="text-indigo-600 text-base">history</mat-icon>
          <span>Riwayat Aktivitas Poin XP Terkini</span>
        </h3>

        <div class="divide-y divide-slate-100">
          @for (act of state().history.slice(0, 5); track act.id) {
            <div class="py-3 flex items-center justify-between gap-3 text-xs">
              <div class="min-w-0">
                <p class="font-bold text-slate-900 truncate">{{ act.title }}</p>
                <p class="text-[11px] text-slate-500">{{ act.description }}</p>
                <span class="text-[10px] text-slate-400">{{ act.createdAt }}</span>
              </div>
              <span class="font-black text-emerald-600 shrink-0">+{{ act.points }} XP</span>
            </div>
          } @empty {
            <div class="py-6 text-center text-slate-400 text-xs">
              Belum ada aktivitas poin tercatat.
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ProfileActivityTabComponent {
  state = gamificationState;

  goToGamification(): void {
    navigateTo('gamification');
  }
}
