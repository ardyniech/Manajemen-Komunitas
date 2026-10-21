import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberEthicalRecord, formatDivision } from './dewan-etik-governance-service';
import { calculateSmartMatch, applySmartMatchToCandidate, DivisionScoreBreakdown } from './smart-matching-engine';

@Component({
  selector: 'app-smart-match-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <mat-icon class="text-base">auto_awesome</mat-icon>
            </span>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Analisis Smart Matching Triad</h3>
              <p class="text-[11px] text-slate-500">{{ record().member?.fullName }} · Weton {{ record().talent.weton.wetonFull }}</p>
            </div>
          </div>
          <button type="button" (click)="modalClose.emit()" class="text-slate-400 hover:text-slate-600 rounded-lg p-1">
            <mat-icon class="text-lg">close</mat-icon>
          </button>
        </div>

        <!-- Composite Score Card -->
        <div class="p-3.5 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 rounded-2xl border border-purple-100/80 flex items-center justify-between">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700">Rekomendasi Utama Algoritma</span>
            <h4 class="text-sm font-black text-slate-900 capitalize">{{ formatDiv(matchResult().topDivision) }}</h4>
            <p class="text-[11px] text-slate-600 mt-0.5">{{ matchResult().primaryReason }}</p>
          </div>
          <div class="text-right shrink-0">
            <span class="text-2xl font-black text-purple-700">{{ matchResult().topScore }}%</span>
            <span class="block text-[10px] text-slate-500 font-semibold">Skor Triad</span>
          </div>
        </div>

        <!-- 3 Pillars Breakdown -->
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] text-slate-400 font-bold block uppercase">Weton Jawa</span>
            <span class="text-base font-black text-indigo-700">{{ matchResult().wetonAlignment }}%</span>
            <span class="text-[9px] text-slate-500 block truncate">{{ record().talent.weton.watakUtama }}</span>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] text-slate-400 font-bold block uppercase">Astrologi</span>
            <span class="text-base font-black text-sky-700">{{ matchResult().astrologyAlignment }}%</span>
            <span class="text-[9px] text-slate-500 block truncate">Unsur {{ record().talent.astrology.element }}</span>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] text-slate-400 font-bold block uppercase">Shio Timur</span>
            <span class="text-base font-black text-amber-700">{{ matchResult().shioAlignment }}%</span>
            <span class="text-[9px] text-slate-500 block truncate">{{ record().talent.astrology.shio }}</span>
          </div>
        </div>

        <!-- Top 3 Placement Matches -->
        <div>
          <span class="text-xs font-bold text-slate-800 block mb-1.5">Peringkat Kecocokan Formasi</span>
          <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            @for (item of topThree(); track item.division) {
              <div class="p-2 rounded-xl bg-slate-50 flex items-center justify-between text-xs hover:bg-slate-100 transition-colors">
                <div class="min-w-0">
                  <span class="font-bold text-slate-900 capitalize">{{ formatDiv(item.division) }}</span>
                  <p class="text-[10px] text-slate-500 truncate">{{ item.rationale }}</p>
                </div>
                <span class="font-extrabold text-slate-800 shrink-0 ml-2">{{ item.compositeScore }}%</span>
              </div>
            }
          </div>
        </div>

        @if (appliedNotice()) {
          <p class="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <mat-icon class="text-sm">check_circle</mat-icon><span>Rekomendasi Smart Matching berhasil diterapkan ke profil!</span>
          </p>
        }

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button type="button" (click)="modalClose.emit()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Tutup</button>
          <button type="button" (click)="applyRecommendation()" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-xs flex items-center gap-1.5">
            <mat-icon class="text-sm">check</mat-icon><span>Terapkan Rekomendasi Utama</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SmartMatchModalComponent {
  record = input.required<MemberEthicalRecord>();
  modalClose = output<void>();

  appliedNotice = signal<boolean>(false);
  formatDiv = formatDivision;

  matchResult = computed(() => calculateSmartMatch(this.record().talent));
  topThree = computed<DivisionScoreBreakdown[]>(() => this.matchResult().breakdown.slice(0, 3));

  applyRecommendation(): void {
    const res = this.matchResult();
    applySmartMatchToCandidate(this.record().talent, res.topDivision, res.topScore);
    this.appliedNotice.set(true);
    setTimeout(() => {
      this.appliedNotice.set(false);
      this.modalClose.emit();
    }, 800);
  }
}
