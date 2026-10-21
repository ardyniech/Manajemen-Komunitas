import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberPersonalTalent, DivisionCategory } from '../../shared/models/personality-talent.model';

@Component({
  selector: 'app-division-fit-matrix',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <mat-icon class="text-indigo-600 text-base">dashboard_customize</mat-icon>
            <span>Matriks Formasi Kepengurusan Komunitas</span>
          </h3>
          <p class="text-xs text-slate-500">Distribusi kecocokan karakter dan ketersediaan kandidat per bidang</p>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        @for (div of divisions; track div.id) {
          <div class="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-2 hover:bg-slate-50 transition-colors">
            <div class="flex items-center justify-between">
              <span [class]="div.badgeColor" class="w-7 h-7 rounded-lg flex items-center justify-center text-white">
                <mat-icon class="text-sm">{{ div.icon }}</mat-icon>
              </span>
              <span class="font-black text-xs text-slate-800">{{ getCandidateCount(div.id) }} Kandidat</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-900 leading-tight">{{ div.name }}</h4>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">{{ div.trait }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DivisionFitMatrixComponent {
  talents = input.required<MemberPersonalTalent[]>();

  readonly divisions: { id: DivisionCategory; name: string; icon: string; badgeColor: string; trait: string }[] = [
    { id: 'ketua_umum', name: 'Ketua / Presidium', icon: 'stars', badgeColor: 'bg-indigo-600', trait: 'Lakuning Lintang / Srengenge • Visioner' },
    { id: 'keuangan_bendahara', name: 'Bendahara Kas', icon: 'account_balance_wallet', badgeColor: 'bg-emerald-600', trait: 'Lakuning Mbulan • Analitis & Jujur' },
    { id: 'dewan_etik', name: 'Dewan Etik', icon: 'gavel', badgeColor: 'bg-purple-600', trait: 'Pendito Sakti / Gunung • Pelindung Nilai' },
    { id: 'humas_komunikasi', name: 'Humas & Kemitraan', icon: 'forum', badgeColor: 'bg-blue-600', trait: 'Lakuning Angin • Diplomat & Luwes' },
    { id: 'acara_operasional', name: 'Operasional Acara', icon: 'event', badgeColor: 'bg-amber-600', trait: 'Lakuning Geni • Eksekutor Lapangan' },
    { id: 'teknologi_media', name: 'IT & Media Kreatif', icon: 'code', badgeColor: 'bg-cyan-600', trait: 'Pendito Mbangun • Inovatif Sistem' }
  ];

  getCandidateCount(divId: DivisionCategory): number {
    return this.talents().filter(t => t.recommendedDivision === divId).length;
  }
}
