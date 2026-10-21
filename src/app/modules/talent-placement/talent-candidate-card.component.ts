import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberPersonalTalent } from '../../shared/models/personality-talent.model';
import { Member } from '../../shared/models/member.model';

@Component({
  selector: 'app-talent-candidate-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <img [src]="member()?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'" [alt]="member()?.fullName || 'Kandidat'" class="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100" />
            <div>
              <h4 class="text-xs font-bold text-slate-900 leading-tight">{{ member()?.fullName || 'Anggota' }}</h4>
              <span class="text-[10px] text-slate-400 font-mono">{{ member()?.memberNumber }}</span>
            </div>
          </div>

          <span class="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-black">
            {{ talent().fitScore }}% Match
          </span>
        </div>

        <div class="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px]">
          <div class="flex items-center justify-between text-slate-700">
            <span class="font-bold flex items-center gap-1 text-amber-900">
              <mat-icon class="text-sm text-amber-600">flare</mat-icon> Weton: {{ talent().weton.wetonFull }}
            </span>
            <span class="text-[10px] text-slate-400 font-mono">Neptu {{ talent().weton.neptu }}</span>
          </div>
          <p class="text-[10px] text-slate-500 leading-tight">{{ talent().weton.watakUtama }} • {{ talent().weton.kelebihan }}</p>

          <div class="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-slate-700">
            <span class="font-bold flex items-center gap-1 text-indigo-900">
              <mat-icon class="text-sm text-indigo-600">wb_twilight</mat-icon> {{ talent().astrology.zodiacSign }} & Shio {{ talent().astrology.shio }}
            </span>
            <span class="text-[10px] text-slate-500">{{ talent().astrology.element }}</span>
          </div>
        </div>

        <div class="space-y-1 text-xs">
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-400">Gaya Kerja:</span>
            <span class="font-semibold text-slate-800 capitalize">{{ talent().workStyle }}</span>
          </div>
          <div class="flex flex-wrap gap-1 pt-1">
            @for (sk of talent().topSkills.slice(0, 3); track sk) {
              <span class="text-[9px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{{ sk }}</span>
            }
          </div>
        </div>
      </div>

      <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span class="text-[9px] text-slate-400 block uppercase font-bold">Rekomendasi</span>
          <span class="text-xs font-bold text-indigo-700">{{ formatDivisionName(talent().recommendedDivision) }}</span>
        </div>

        <button
          type="button"
          (click)="openDetail.emit(talent())"
          class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs"
        >
          <mat-icon class="text-sm text-purple-300">gavel</mat-icon>
          <span>Asesmen Etik</span>
        </button>
      </div>
    </div>
  `
})
export class TalentCandidateCardComponent {
  talent = input.required<MemberPersonalTalent>();
  member = input<Member | undefined>();
  openDetail = output<MemberPersonalTalent>();

  formatDivisionName(div: string): string {
    switch (div) {
      case 'ketua_umum': return 'Ketua Umum';
      case 'keuangan_bendahara': return 'Bendahara Kas';
      case 'dewan_etik': return 'Dewan Etik';
      case 'humas_komunikasi': return 'Humas';
      case 'acara_operasional': return 'Operasional';
      case 'teknologi_media': return 'IT & Media';
      default: return 'Pengurus';
    }
  }
}
