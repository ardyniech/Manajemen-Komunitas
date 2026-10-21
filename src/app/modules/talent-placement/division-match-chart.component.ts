import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TalentAnalyticsSummary } from './talent-analytics-service';
import { transformDivisionMatchData, DivisionMatchDatum } from './division-match-data';
import { DivisionMatchBarViewComponent } from './division-match-bar-view.component';
import { DivisionMatchPieViewComponent } from './division-match-pie-view.component';
import { DivisionChartTooltipComponent } from './division-chart-tooltip.component';
import { DivisionCategory } from '../../shared/models/personality-talent.model';

@Component({
  selector: 'app-division-match-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatIconModule, DivisionMatchBarViewComponent,
    DivisionMatchPieViewComponent, DivisionChartTooltipComponent
  ],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-slate-900 tracking-tight">Distribusi Persentase Kecocokan per Divisi</h3>
            <span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">Smart Triad</span>
            @if (selectedDivision() !== 'all') {
              <button type="button" (click)="divisionSelect.emit('all')" class="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-0.5 hover:bg-rose-100 transition-colors">
                <mat-icon class="text-xs">close</mat-icon><span>Reset Filter ({{ selectedDivision().replace('_', ' ') }})</span>
              </button>
            }
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Arahkan kursor ke grafik untuk melihat detail anggota, atau klik untuk memfilter tabel.</p>
        </div>

        <!-- Mode Toggle: Bar vs Pie -->
        <div class="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            (click)="chartType.set('bar')"
            [class]="chartType() === 'bar' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'"
            class="px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
          >
            <mat-icon class="text-sm">bar_chart</mat-icon>
            <span>Batang</span>
          </button>
          <button
            type="button"
            (click)="chartType.set('pie')"
            [class]="chartType() === 'pie' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'"
            class="px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
          >
            <mat-icon class="text-sm">pie_chart</mat-icon>
            <span>Donat</span>
          </button>
        </div>
      </div>

      <!-- Main Interactive Chart Canvas & Tooltip Container -->
      <div class="relative min-h-[230px]">
        @if (chartType() === 'bar') {
          <app-division-match-bar-view
            [data]="chartData()"
            [hoveredId]="hovered()?.id || null"
            (hoverChange)="hovered.set($event)"
            (selectDivision)="onSelectDivision($event)"
          />
        } @else {
          <app-division-match-pie-view
            [data]="chartData()"
            (hoverChange)="hovered.set($event)"
            (selectDivision)="onSelectDivision($event)"
          />
        }

        <!-- Floating Recharts-Style Interactive Tooltip Overlay -->
        @if (hovered(); as h) {
          <div class="mt-3 lg:mt-0 lg:absolute lg:top-1 lg:right-2 z-20 flex justify-end">
            <app-division-chart-tooltip [datum]="h" />
          </div>
        }
      </div>
    </div>
  `
})
export class DivisionMatchChartComponent {
  summary = input.required<TalentAnalyticsSummary>();
  selectedDivision = input<'all' | DivisionCategory>('all');
  divisionSelect = output<'all' | DivisionCategory>();

  chartType = signal<'bar' | 'pie'>('bar');
  hovered = signal<DivisionMatchDatum | null>(null);

  chartData = computed(() => transformDivisionMatchData(this.summary()));

  onSelectDivision(divId: string): void {
    this.divisionSelect.emit(divId as DivisionCategory);
  }
}
