import { ChangeDetectionStrategy, Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberPersonalTalent } from '../../shared/models/personality-talent.model';
import { Member } from '../../shared/models/member.model';
import { calculateLeadershipHarmony } from '../../shared/utils/leadership-harmony-calculator';

@Component({
  selector: 'app-leadership-harmony-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-5">
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
              <mat-icon class="text-purple-600 text-base">compare_arrows</mat-icon>
              <span>Uji Kompatibilitas & Harmoni Duet Pengurus</span>
            </h3>
            <p class="text-xs text-slate-500">Analisis keselarasan watak, weton, dan astrologi antar-pimpinan divisi</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <!-- Leader A Selector -->
          <div class="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-2">
            <label for="lead-a" class="block text-xs font-bold text-indigo-950">Pilih Pengurus A (Ketua / Koordinator):</label>
            <select id="lead-a" [value]="selectedLeaderAId()" (change)="selectedLeaderAId.set($any($event.target).value)" class="w-full p-2 text-xs rounded-xl border border-indigo-200 bg-white font-medium">
              @for (tal of talents(); track tal.memberId) {
                <option [value]="tal.memberId">{{ getMemberName(tal.memberId) }} ({{ tal.weton.wetonFull }})</option>
              }
            </select>
            @if (leaderA(); as la) {
              <div class="text-[11px] text-slate-600 space-y-0.5 pt-1">
                <p><strong>Watak:</strong> {{ la.weton.watakUtama }} (Neptu {{ la.weton.neptu }})</p>
                <p><strong>Astrologi:</strong> {{ la.astrology.zodiacSign }} ({{ la.astrology.element }})</p>
              </div>
            }
          </div>

          <!-- Leader B Selector -->
          <div class="p-3.5 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
            <label for="lead-b" class="block text-xs font-bold text-purple-950">Pilih Pengurus B (Wakil / Bendahara / Etik):</label>
            <select id="lead-b" [value]="selectedLeaderBId()" (change)="selectedLeaderBId.set($any($event.target).value)" class="w-full p-2 text-xs rounded-xl border border-purple-200 bg-white font-medium">
              @for (tal of talents(); track tal.memberId) {
                <option [value]="tal.memberId">{{ getMemberName(tal.memberId) }} ({{ tal.weton.wetonFull }})</option>
              }
            </select>
            @if (leaderB(); as lb) {
              <div class="text-[11px] text-slate-600 space-y-0.5 pt-1">
                <p><strong>Watak:</strong> {{ lb.weton.watakUtama }} (Neptu {{ lb.weton.neptu }})</p>
                <p><strong>Astrologi:</strong> {{ lb.astrology.zodiacSign }} ({{ lb.astrology.element }})</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Harmony Analysis Result -->
      @if (analysis(); as res) {
        <div class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                Kategori Petung: {{ res.javanesePetungCategory }}
              </span>
              <h4 class="text-base font-bold text-white mt-2">{{ res.synergyLevel }}</h4>
              <p class="text-xs text-slate-300">Total Neptu Gabungan: {{ res.wetonNeptuCombined }}</p>
            </div>
            <div class="text-right flex items-baseline gap-1 sm:block">
              <span class="text-4xl font-black text-amber-400">{{ res.compatibilityScore }}%</span>
              <span class="text-xs text-slate-300 block">Indeks Harmoni</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
              <span class="font-bold text-emerald-400 flex items-center gap-1"><mat-icon class="text-sm">check_circle</mat-icon> Kekuatan Sinergi Duet:</span>
              <ul class="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                @for (str of res.collaborationStrengths; track str) { <li>{{ str }}</li> }
              </ul>
            </div>

            <div class="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
              <span class="font-bold text-amber-400 flex items-center gap-1"><mat-icon class="text-sm">warning</mat-icon> Rekomendasi Dewan Etik:</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">{{ res.dewanEtikRecommendation }}</p>
              <p class="text-slate-400 text-[10px] mt-1">{{ res.elementalDynamic }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class LeadershipHarmonyTabComponent {
  talents = input.required<MemberPersonalTalent[]>();
  members = input.required<Member[]>();

  selectedLeaderAId = signal<string>('mem-1');
  selectedLeaderBId = signal<string>('mem-2');

  leaderA = computed(() => this.talents().find(t => t.memberId === this.selectedLeaderAId()) || this.talents()[0]);
  leaderB = computed(() => this.talents().find(t => t.memberId === this.selectedLeaderBId()) || this.talents()[1] || this.talents()[0]);

  analysis = computed(() => {
    const a = this.leaderA();
    const b = this.leaderB();
    if (!a || !b) return null;
    return calculateLeadershipHarmony(a, b);
  });

  getMemberName(id: string): string {
    return this.members().find(m => m.id === id)?.fullName || id;
  }
}
