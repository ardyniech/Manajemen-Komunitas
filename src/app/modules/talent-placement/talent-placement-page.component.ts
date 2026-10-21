import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TalentPlacementHeaderComponent } from './talent-placement-header.component';
import { DivisionFitMatrixComponent } from './division-fit-matrix.component';
import { TalentCandidateCardComponent } from './talent-candidate-card.component';
import { TalentDetailModalComponent } from './talent-detail-modal.component';
import { LeadershipHarmonyTabComponent } from './leadership-harmony-tab.component';
import { BoardDecreeExportModalComponent } from './board-decree-export-modal.component';
import { DewanEtikDashboardComponent } from './dewan-etik-dashboard.component';
import { talentProfilesState } from '../../core/talent/talent.service';
import { membersState } from '../../shared/utils/storage';
import { MemberPersonalTalent, DivisionCategory } from '../../shared/models/personality-talent.model';
import { activeUserContext, hasAppPermission } from '../../core/rbac.service';

@Component({
  selector: 'app-talent-placement-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatIconModule, TalentPlacementHeaderComponent,
    DivisionFitMatrixComponent, TalentCandidateCardComponent, TalentDetailModalComponent,
    LeadershipHarmonyTabComponent, BoardDecreeExportModalComponent, DewanEtikDashboardComponent
  ],
  template: `
    <div class="space-y-6">
      @if (!canAccess()) {
        <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-xs">
          <mat-icon class="text-5xl text-amber-500 mb-3">lock</mat-icon>
          <h2 class="text-lg font-bold text-slate-900">Hak Akses Dewan Etik & Admin</h2>
          <p class="text-xs text-slate-500 mt-1">Halaman asesmen kepengurusan ini hanya dapat diakses oleh Admin, Ketua, dan Majelis Dewan Etik.</p>
        </div>
      } @else {
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
            <button type="button" (click)="activeTab.set('dashboard')" [class]="activeTab() === 'dashboard' ? 'bg-white text-purple-800 shadow-xs font-bold' : 'text-slate-600'" class="px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
              <mat-icon class="text-sm">analytics</mat-icon><span>Dashboard Analitik</span>
            </button>
            <button type="button" (click)="activeTab.set('candidates')" [class]="activeTab() === 'candidates' ? 'bg-white text-purple-800 shadow-xs font-bold' : 'text-slate-600'" class="px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
              <mat-icon class="text-sm">groups</mat-icon><span>Kandidat & Formasi</span>
            </button>
            <button type="button" (click)="activeTab.set('harmony')" [class]="activeTab() === 'harmony' ? 'bg-white text-purple-800 shadow-xs font-bold' : 'text-slate-600'" class="px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
              <mat-icon class="text-sm">compare_arrows</mat-icon><span>Uji Harmoni Duet</span>
            </button>
          </div>

          <button type="button" (click)="isDecreeModalOpen.set(true)" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5">
            <mat-icon class="text-sm text-amber-400">description</mat-icon><span>Cetak SK Penetapan Pengurus</span>
          </button>
        </div>

        @if (activeTab() === 'dashboard') {
          <app-dewan-etik-dashboard />
        } @else if (activeTab() === 'harmony') {
          <app-leadership-harmony-tab [talents]="talents()" [members]="members()" />
        } @else {
          <app-talent-placement-header [selectedDivision]="selectedDiv()" [searchTerm]="searchQuery()" (divisionChange)="selectedDiv.set($event)" (searchChange)="searchQuery.set($event)" />
          <app-division-fit-matrix [talents]="talents()" />

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (tal of filteredCandidates(); track tal.memberId) {
              <app-talent-candidate-card [talent]="tal" [member]="getMember(tal.memberId)" (openDetail)="activeDetailTalent.set($event)" />
            } @empty {
              <div class="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200">
                <mat-icon class="text-4xl text-slate-300 mb-2">person_search</mat-icon>
                <h3 class="font-bold text-slate-700 text-sm">Tidak ada kandidat pada kriteria ini</h3>
              </div>
            }
          </div>
        }

        @if (activeDetailTalent(); as t) { <app-talent-detail-modal [talent]="t" [member]="getMember(t.memberId)" (modalClose)="activeDetailTalent.set(null)" /> }
        @if (isDecreeModalOpen()) { <app-board-decree-export-modal [talents]="talents()" [members]="members()" (modalClose)="isDecreeModalOpen.set(false)" /> }
      }
    </div>
  `
})
export class TalentPlacementPageComponent {
  talents = talentProfilesState;
  members = membersState;
  currentUser = activeUserContext;

  activeTab = signal<'dashboard' | 'candidates' | 'harmony'>('dashboard');
  selectedDiv = signal<'all' | DivisionCategory>('all');
  searchQuery = signal<string>('');
  activeDetailTalent = signal<MemberPersonalTalent | null>(null);
  isDecreeModalOpen = signal<boolean>(false);

  canAccess = computed(() => {
    const role = this.currentUser().roleCode;
    return role === 'super_admin' || role === 'ketua' || role === 'moderator' || hasAppPermission('manage_roles');
  });

  filteredCandidates = computed(() => {
    const list = this.talents();
    const div = this.selectedDiv();
    const q = this.searchQuery().toLowerCase().trim();

    return list.filter(t => {
      const mem = this.getMember(t.memberId);
      const matchDiv = div === 'all' || t.recommendedDivision === div || t.preferredDivisions.includes(div);
      const matchQ = !q || (mem?.fullName || '').toLowerCase().includes(q) ||
        t.weton.wetonFull.toLowerCase().includes(q) ||
        t.astrology.zodiacSign.toLowerCase().includes(q) ||
        t.topSkills.some(s => s.toLowerCase().includes(q));
      return matchDiv && matchQ;
    });
  });

  getMember(id: string) { return this.members().find(m => m.id === id); }
}
