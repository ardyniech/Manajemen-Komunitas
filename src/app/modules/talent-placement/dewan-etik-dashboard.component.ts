import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DewanEtikStatCardsComponent } from './dewan-etik-stat-cards.component';
import { TalentDistributionChartsComponent } from './talent-distribution-charts.component';
import { DivisionReadinessHeatmapComponent } from './division-readiness-heatmap.component';
import { DivisionMatchChartComponent } from './division-match-chart.component';
import { DewanEtikConflictPanelComponent } from './dewan-etik-conflict-panel.component';
import { DewanEtikMemberTableComponent } from './dewan-etik-member-table.component';
import { DewanEtikActivityLogComponent } from './dewan-etik-activity-log.component';
import { DewanEtikReviewModalComponent } from './dewan-etik-review-modal.component';
import { EthicalClearanceModalComponent } from './ethical-clearance-modal.component';
import { DewanEtikSmartMatchingCardComponent } from './dewan-etik-smart-matching-card.component';
import { SmartMatchModalComponent } from './smart-match-modal.component';
import { talentAnalyticsSummary } from './talent-analytics-service';
import { MemberEthicalRecord } from './dewan-etik-governance-service';
import { DivisionCategory } from '../../shared/models/personality-talent.model';

@Component({
  selector: 'app-dewan-etik-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatIconModule, DewanEtikStatCardsComponent,
    DewanEtikConflictPanelComponent, DewanEtikMemberTableComponent,
    DivisionMatchChartComponent, TalentDistributionChartsComponent,
    DivisionReadinessHeatmapComponent, DewanEtikActivityLogComponent,
    DewanEtikReviewModalComponent, EthicalClearanceModalComponent,
    DewanEtikSmartMatchingCardComponent, SmartMatchModalComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Light Theme Header Banner -->
      <div class="bg-gradient-to-r from-amber-50/80 via-indigo-50/50 to-slate-50 rounded-2xl p-5 border border-indigo-100/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <span class="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <mat-icon class="text-2xl">shield</mat-icon>
          </span>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-slate-900 tracking-tight">Dasbor Manajemen & Pengawasan Dewan Etik</h3>
              <span class="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">Majelis Kehormatan</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">Penapisan integritas anggota, klirens formasi AD/ART, dan audit kepatutan duet neptu weton.</p>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <app-dewan-etik-stat-cards [summary]="summary()" />

      <!-- Smart Matching Triad Hub with Interactive Division Filter -->
      <app-dewan-etik-smart-matching-card
        [selectedDivision]="activeDivision()"
        (divisionChange)="activeDivision.set($event)"
      />

      <!-- Interactive Division Match Percentage Distribution Chart (Bar & Pie) -->
      <app-division-match-chart
        [summary]="summary()"
        [selectedDivision]="activeDivision()"
        (divisionSelect)="activeDivision.set($event)"
      />

      <!-- Conflict & Compliance Surveillance -->
      <app-dewan-etik-conflict-panel (reviewCandidate)="activeReviewRecord.set($event)" />

      <!-- Interactive Member Governance Table Filtered by Division -->
      <app-dewan-etik-member-table
        [divisionFilter]="activeDivision()"
        (divisionChange)="activeDivision.set($event)"
        (openReview)="activeReviewRecord.set($event)"
        (openClearance)="activeClearanceRecord.set($event)"
        (openSmartMatch)="activeSmartMatchRecord.set($event)"
      />

      <!-- Transparency & Governance Audit Trail Log -->
      <app-dewan-etik-activity-log />

      <!-- Talent Distribution & Heatmap Analytics -->
      <div class="space-y-6 pt-2">
        <app-talent-distribution-charts [summary]="summary()" />
        <app-division-readiness-heatmap [summary]="summary()" />
      </div>

      <!-- Modals -->
      @if (activeReviewRecord(); as r) {
        <app-dewan-etik-review-modal [record]="r" (modalClose)="activeReviewRecord.set(null)" />
      }
      @if (activeClearanceRecord(); as c) {
        <app-ethical-clearance-modal [record]="c" (modalClose)="activeClearanceRecord.set(null)" />
      }
      @if (activeSmartMatchRecord(); as s) {
        <app-smart-match-modal [record]="s" (modalClose)="activeSmartMatchRecord.set(null)" />
      }
    </div>
  `
})
export class DewanEtikDashboardComponent {
  summary = talentAnalyticsSummary;
  activeDivision = signal<'all' | DivisionCategory>('all');
  activeReviewRecord = signal<MemberEthicalRecord | null>(null);
  activeClearanceRecord = signal<MemberEthicalRecord | null>(null);
  activeSmartMatchRecord = signal<MemberEthicalRecord | null>(null);
}
