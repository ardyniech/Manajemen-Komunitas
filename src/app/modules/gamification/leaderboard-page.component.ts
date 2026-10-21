import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { leaderboardRanks } from '../../core/gamification/gamification.service';
import { currentUser } from '../../core/auth/auth.service';

@Component({
  selector: 'app-leaderboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="bg-gradient-to-r from-amber-50/80 via-indigo-50/50 to-slate-50 rounded-2xl p-5 border border-indigo-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <span class="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
            <mat-icon class="text-2xl">leaderboard</mat-icon>
          </span>
          <div>
            <h2 class="text-base font-bold text-slate-900 tracking-tight">Papan Peringkat Kontributor</h2>
            <p class="text-xs text-slate-500 mt-0.5">Apresiasi partisipasi, keaktifan iuran, diskusi forum, dan kehadiran anggota.</p>
          </div>
        </div>
      </div>

      <!-- Podium Top 3 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
        @if (ranks().length > 1) {
          <div class="bg-white rounded-2xl p-5 border border-slate-200 text-center order-2 md:order-1 shadow-xs">
            <span class="inline-block p-1.5 bg-slate-100 text-slate-700 rounded-full mb-2 text-xs font-bold">Juara 2</span>
            <img [src]="ranks()[1].avatarUrl" [alt]="ranks()[1].memberName" class="w-16 h-16 rounded-full mx-auto ring-4 ring-slate-200 object-cover mb-2" />
            <h4 class="text-xs font-bold text-slate-800">{{ ranks()[1].memberName }}</h4>
            <span class="text-[10px] text-slate-500 block mb-2">{{ ranks()[1].levelName }}</span>
            <span class="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{{ ranks()[1].totalPoints }} XP</span>
          </div>
        }

        @if (ranks().length > 0) {
          <div class="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 border-2 border-amber-300 text-center order-1 md:order-2 shadow-md transform md:-translate-y-2">
            <span class="inline-block px-3 py-1 bg-amber-400 text-amber-950 rounded-full mb-2 text-xs font-black">👑 JUARA 1</span>
            <img [src]="ranks()[0].avatarUrl" [alt]="ranks()[0].memberName" class="w-20 h-20 rounded-full mx-auto ring-4 ring-amber-400 object-cover mb-2" />
            <h3 class="text-sm font-bold text-slate-900">{{ ranks()[0].memberName }}</h3>
            <span class="text-xs text-amber-700 font-semibold block mb-2">{{ ranks()[0].levelName }}</span>
            <span class="text-sm font-black text-white bg-indigo-600 px-4 py-1.5 rounded-full shadow-xs">{{ ranks()[0].totalPoints }} XP</span>
          </div>
        }

        @if (ranks().length > 2) {
          <div class="bg-white rounded-2xl p-5 border border-slate-200 text-center order-3 shadow-xs">
            <span class="inline-block p-1.5 bg-amber-100 text-amber-800 rounded-full mb-2 text-xs font-bold">Juara 3</span>
            <img [src]="ranks()[2].avatarUrl" [alt]="ranks()[2].memberName" class="w-16 h-16 rounded-full mx-auto ring-4 ring-amber-200 object-cover mb-2" />
            <h4 class="text-xs font-bold text-slate-800">{{ ranks()[2].memberName }}</h4>
            <span class="text-[10px] text-slate-500 block mb-2">{{ ranks()[2].levelName }}</span>
            <span class="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{{ ranks()[2].totalPoints }} XP</span>
          </div>
        }
      </div>

      <!-- Full Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs overflow-hidden">
        <h3 class="text-xs font-bold text-slate-900 mb-3">Daftar Lengkap 10 Besar</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 text-slate-400">
                <th class="pb-2 font-bold w-12 text-center">POS</th>
                <th class="pb-2 font-bold">ANGGOTA</th>
                <th class="pb-2 font-bold">LEVEL & TIER</th>
                <th class="pb-2 font-bold text-right">TOTAL XP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (r of ranks(); track r.memberId) {
                <tr [class]="r.memberId === user().id ? 'bg-indigo-50/60 font-semibold' : 'hover:bg-slate-50'" class="transition-colors">
                  <td class="py-3 text-center font-bold text-slate-700">#{{ r.rank }}</td>
                  <td class="py-3">
                    <div class="flex items-center gap-2.5">
                      <img [src]="r.avatarUrl" [alt]="r.memberName" class="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span class="font-bold text-slate-900 block">{{ r.memberName }}</span>
                        <span class="text-[10px] text-slate-400">{{ r.memberNumber }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3">
                    <span class="font-medium text-slate-700 block">{{ r.levelName }}</span>
                    <span class="text-[10px] uppercase tracking-wider text-slate-400">{{ r.tier }}</span>
                  </td>
                  <td class="py-3 text-right font-black text-indigo-600">{{ r.totalPoints }} XP</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class LeaderboardPageComponent {
  ranks = leaderboardRanks;
  user = currentUser;
}
