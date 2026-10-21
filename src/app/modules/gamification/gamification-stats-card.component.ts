import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberGamification } from '../../shared/models/gamification.model';
import { calculateLevel } from '../../core/gamification/level-system';

@Component({
  selector: 'app-gamification-stats-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-indigo-500/10 pointer-events-none blur-xl"></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-amber-400 text-amber-950 font-extrabold text-xs rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <mat-icon class="text-sm">stars</mat-icon>
              <span>Level {{ gamification().currentLevel }} • {{ gamification().levelName }}</span>
            </span>
            <span class="text-xs text-indigo-200">{{ gamification().rankTitle }}</span>
          </div>

          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black tracking-tight text-white">{{ gamification().totalPoints }}</span>
            <span class="text-sm font-semibold text-indigo-200">Total XP Poin</span>
          </div>

          <p class="text-xs text-indigo-100/80 max-w-md">
            Dapatkan poin dari membayar iuran tepat waktu, membuat topik di forum, mengundang anggota, dan menghadiri kegiatan.
          </p>
        </div>

        <!-- Progress to next level -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[260px] space-y-2.5">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-indigo-200">Progres Menuju Level Selanjutnya</span>
            <span class="text-amber-300">{{ levelInfo().progressPercent }}%</span>
          </div>

          <div class="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              class="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-500"
              [style.width.%]="levelInfo().progressPercent"
            ></div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-indigo-200">
            <span>{{ gamification().totalPoints }} XP</span>
            <span>Target: {{ levelInfo().nextLevelPoints }} XP</span>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-center">
        <div class="bg-white/5 rounded-xl p-2.5 border border-white/10">
          <span class="block text-lg font-bold text-amber-300">{{ gamification().eventsAttendedCount }}</span>
          <span class="text-[11px] text-indigo-200">Agenda Diikuti</span>
        </div>
        <div class="bg-white/5 rounded-xl p-2.5 border border-white/10">
          <span class="block text-lg font-bold text-emerald-300">{{ gamification().duesPaidCount }}x</span>
          <span class="text-[11px] text-indigo-200">Iuran Tepat Waktu</span>
        </div>
        <div class="bg-white/5 rounded-xl p-2.5 border border-white/10">
          <span class="block text-lg font-bold text-sky-300">{{ gamification().forumPostsCount }}</span>
          <span class="text-[11px] text-indigo-200">Postingan Forum</span>
        </div>
        <div class="bg-white/5 rounded-xl p-2.5 border border-white/10">
          <span class="block text-lg font-bold text-purple-300">{{ gamification().referralsCount }}</span>
          <span class="text-[11px] text-indigo-200">Rekan Diundang</span>
        </div>
      </div>
    </div>
  `
})
export class GamificationStatsCardComponent {
  gamification = input.required<MemberGamification>();
  levelInfo = computed(() => calculateLevel(this.gamification().totalPoints));
}
