import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { DivisionMatchDatum } from './division-match-data';

@Component({
  selector: 'app-division-match-pie-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col sm:flex-row items-center justify-center gap-6 py-2 select-none">
      <div class="relative w-48 h-48 shrink-0">
        <svg viewBox="-100 -100 200 200" class="w-full h-full overflow-visible">
          @for (slice of pieArcs(); track slice.data.id) {
            <path
              [attr.d]="slice.path"
              [attr.fill]="slice.data.color"
              [attr.stroke]="hoveredId() === slice.data.id ? '#ffffff' : '#ffffff'"
              [attr.stroke-width]="hoveredId() === slice.data.id ? '3' : '1.5'"
              [style.transform]="hoveredId() === slice.data.id ? 'scale(1.06)' : 'scale(1)'"
              style="transform-origin: 0 0; transition: transform 0.2s ease, opacity 0.2s ease;"
              class="cursor-pointer hover:opacity-95"
              (mouseenter)="onHover(slice.data)"
              (mouseleave)="onLeave()"
              (click)="selectDivision.emit(slice.data.id)"
            />
          }
        </svg>

        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span class="text-[10px] uppercase font-bold text-slate-400">Rata-Rata</span>
          <span class="text-xl font-black text-slate-800">{{ overallAvg() }}%</span>
          <span class="text-[9px] text-indigo-600 font-semibold">Harmoni</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs w-full max-w-xs">
        @for (item of data(); track item.id) {
          <button
            type="button"
            (mouseenter)="onHover(item)"
            (mouseleave)="onLeave()"
            (click)="selectDivision.emit(item.id)"
            [class]="hoveredId() === item.id ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-200/50' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'"
            class="p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-left w-full"
          >
            <span class="w-3 h-3 rounded-full shrink-0" [style.background-color]="item.color"></span>
            <span class="min-w-0 flex-1">
              <span class="font-bold text-slate-800 truncate block text-[11px]">{{ item.shortLabel }}</span>
              <span class="text-[10px] text-slate-500">{{ item.avgScore }}% ({{ item.count }} org)</span>
            </span>
          </button>
        }
      </div>
    </div>
  `
})
export class DivisionMatchPieViewComponent {
  data = input.required<DivisionMatchDatum[]>();
  hoverChange = output<DivisionMatchDatum | null>();
  selectDivision = output<string>();
  hoveredId = signal<string | null>(null);

  overallAvg = computed(() => {
    const list = this.data();
    if (!list.length) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.avgScore, 0);
    return Math.round(sum / list.length);
  });

  pieArcs = computed(() => {
    const list = this.data();
    const pieGen = d3.pie<DivisionMatchDatum>().value(d => Math.max(1, d.count)).sort(null);
    const arcGen = d3.arc<d3.PieArcDatum<DivisionMatchDatum>>().innerRadius(55).outerRadius(85).cornerRadius(4).padAngle(0.03);
    return pieGen(list).map(a => ({ data: a.data, path: arcGen(a) || '' }));
  });

  onHover(item: DivisionMatchDatum): void {
    this.hoveredId.set(item.id);
    this.hoverChange.emit(item);
  }

  onLeave(): void {
    this.hoveredId.set(null);
    this.hoverChange.emit(null);
  }
}
