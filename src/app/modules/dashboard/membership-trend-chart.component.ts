import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import * as d3 from 'd3';
import { membersState } from '../../shared/utils/storage';
import { AppInfoTooltip } from '../../shared/atoms/info-tooltip.component';

interface TrendData { month: string; total: number; active: number; }

@Component({
  selector: 'app-membership-trend-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppInfoTooltip],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      <div class="flex items-center justify-between mb-4">
        <div>
          <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Visualisasi D3.js</span>
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <mat-icon class="text-base text-indigo-600">trending_up</mat-icon>
            <span>Monthly Membership Trends</span>
            <app-info-tooltip
              title="Tren Keanggotaan"
              text="Historis perbandingan total anggota terdaftar dan anggota aktif 6 bulan terakhir."
              position="bottom"
            />
          </h3>
        </div>
        <div class="flex items-center gap-2 text-[11px]">
          <span class="inline-flex items-center gap-1 font-semibold text-indigo-600"><span class="w-2 h-2 rounded-full bg-indigo-600"></span> Total</span>
          <span class="inline-flex items-center gap-1 font-semibold text-emerald-600"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif</span>
        </div>
      </div>

      <div class="flex-1 w-full min-h-[190px] relative" #chartContainer>
        <svg #svgElement class="w-full h-full overflow-visible"></svg>
        @if (hoveredPoint()) {
          <div class="absolute top-2 right-2 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-md pointer-events-none">
            <span class="font-bold block text-indigo-300">{{ hoveredPoint()?.month }}</span>
            <span>Total: <b>{{ hoveredPoint()?.total }}</b> (Aktif: {{ hoveredPoint()?.active }})</span>
          </div>
        }
      </div>

      <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Pertumbuhan Anggota (6 Bulan Terakhir)</span>
        <span class="font-bold text-emerald-600 flex items-center gap-0.5"><mat-icon class="text-sm">arrow_upward</mat-icon> +18.4%</span>
      </div>
    </div>
  `
})
export class MembershipTrendChartComponent {
  private el = inject(ElementRef);
  svgRef = viewChild<ElementRef<SVGElement>>('svgElement');
  containerRef = viewChild<ElementRef<HTMLDivElement>>('chartContainer');
  hoveredPoint = signal<TrendData | null>(null);

  constructor() {
    afterNextRender(() => this.renderChart());
  }

  private renderChart(): void {
    const svgEl = this.svgRef()?.nativeElement;
    if (!svgEl) return;

    const data: TrendData[] = [
      { month: 'Apr', total: 18, active: 15 },
      { month: 'Mei', total: 24, active: 20 },
      { month: 'Jun', total: 31, active: 26 },
      { month: 'Jul', total: 38, active: 32 },
      { month: 'Agu', total: 45, active: 39 },
      { month: 'Sep', total: Math.max(52, membersState().length), active: membersState().filter(m => m.status === 'aktif').length || 46 }
    ];

    const width = 460;
    const height = 180;
    const margin = { top: 15, right: 15, bottom: 25, left: 30 };

    const svg = d3.select(svgEl).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const x = d3.scalePoint().domain(data.map(d => d.month)).range([margin.left, width - margin.right]).padding(0.2);
    const maxY = (d3.max(data, d => d.total) || 50) + 10;
    const y = d3.scaleLinear().domain([0, maxY]).nice().range([height - margin.bottom, margin.top]);

    svg.append('g').attr('class', 'grid').attr('opacity', 0.1).attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(4).tickSize(-width + margin.left + margin.right).tickFormat(() => ''));

    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'areaGrad').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#6366f1').attr('stop-opacity', 0.35);
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#6366f1').attr('stop-opacity', 0.0);

    const area = d3.area<TrendData>().x(d => x(d.month) || 0).y0(height - margin.bottom).y1(d => y(d.total)).curve(d3.curveMonotoneX);
    svg.append('path').datum(data).attr('fill', 'url(#areaGrad)').attr('d', area);

    const lineTotal = d3.line<TrendData>().x(d => x(d.month) || 0).y(d => y(d.total)).curve(d3.curveMonotoneX);
    svg.append('path').datum(data).attr('fill', 'none').attr('stroke', '#6366f1').attr('stroke-width', 2.5).attr('d', lineTotal);

    const lineActive = d3.line<TrendData>().x(d => x(d.month) || 0).y(d => y(d.active)).curve(d3.curveMonotoneX);
    svg.append('path').datum(data).attr('fill', 'none').attr('stroke', '#10b981').attr('stroke-width', 2).attr('stroke-dasharray', '4,4').attr('d', lineActive);

    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0)).call(g => g.select('.domain').attr('stroke', '#e2e8f0'))
      .call(g => g.selectAll('text').attr('fill', '#64748b').attr('font-size', '10px').attr('dy', '10px'));

    svg.selectAll('.dot').data(data).enter().append('circle')
      .attr('cx', d => x(d.month) || 0).attr('cy', d => y(d.total)).attr('r', 4)
      .attr('fill', '#6366f1').attr('stroke', '#ffffff').attr('stroke-width', 2)
      .attr('class', 'cursor-pointer hover:r-6 transition-all')
      .on('mouseenter', (_, d) => this.hoveredPoint.set(d))
      .on('mouseleave', () => this.hoveredPoint.set(null));
  }
}
