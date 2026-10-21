import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import * as d3 from 'd3';
import { AppInfoTooltip } from '../../shared/atoms/info-tooltip.component';

interface CashFlowMonth {
  month: string;
  inflow: number;
  outflow: number;
}

@Component({
  selector: 'app-cash-flow-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppInfoTooltip],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      <div class="flex items-center justify-between mb-4">
        <div>
          <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Visualisasi D3.js</span>
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <mat-icon class="text-base text-emerald-600">account_balance_wallet</mat-icon>
            <span>Cash Flow Summary</span>
            <app-info-tooltip
              title="Ringkasan Arus Kas"
              text="Perbandingan arus kas masuk (iuran) vs arus kas keluar (operasional) per bulan."
              position="bottom"
            />
          </h3>
        </div>
        <div class="flex items-center gap-2 text-[11px]">
          <span class="inline-flex items-center gap-1 font-semibold text-emerald-600"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Masuk</span>
          <span class="inline-flex items-center gap-1 font-semibold text-rose-500"><span class="w-2 h-2 rounded-full bg-rose-500"></span> Keluar</span>
        </div>
      </div>

      <div class="flex-1 w-full min-h-[190px] relative" #chartContainer>
        <svg #svgElement class="w-full h-full overflow-visible"></svg>
        @if (hoveredData()) {
          <div class="absolute top-2 right-2 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-md pointer-events-none">
            <span class="font-bold block text-emerald-300">{{ hoveredData()?.month }}</span>
            <div class="text-emerald-400">Masuk: Rp {{ (hoveredData()?.inflow || 0).toLocaleString('id-ID') }}</div>
            <div class="text-rose-400">Keluar: Rp {{ (hoveredData()?.outflow || 0).toLocaleString('id-ID') }}</div>
          </div>
        }
      </div>

      <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Surplus Kas Bersih</span>
        <span class="font-bold text-emerald-600">+Rp 7.850.000</span>
      </div>
    </div>
  `
})
export class CashFlowChartComponent {
  private el = inject(ElementRef);
  svgRef = viewChild<ElementRef<SVGElement>>('svgElement');
  containerRef = viewChild<ElementRef<HTMLDivElement>>('chartContainer');
  hoveredData = signal<CashFlowMonth | null>(null);

  constructor() {
    afterNextRender(() => this.renderChart());
  }

  private renderChart(): void {
    const svgEl = this.svgRef()?.nativeElement;
    if (!svgEl) return;

    const data: CashFlowMonth[] = [
      { month: 'Mei', inflow: 3200000, outflow: 1200000 },
      { month: 'Jun', inflow: 4500000, outflow: 1800000 },
      { month: 'Jul', inflow: 3800000, outflow: 2100000 },
      { month: 'Agu', inflow: 5200000, outflow: 1400000 },
      { month: 'Sep', inflow: 6100000, outflow: 1950000 }
    ];

    const width = 460;
    const height = 180;
    const margin = { top: 15, right: 15, bottom: 25, left: 35 };

    const svg = d3.select(svgEl).attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const x0 = d3.scaleBand().domain(data.map(d => d.month)).range([margin.left, width - margin.right]).paddingInner(0.25);
    const x1 = d3.scaleBand().domain(['inflow', 'outflow']).range([0, x0.bandwidth()]).padding(0.1);
    const maxVal = d3.max(data, d => Math.max(d.inflow, d.outflow)) || 6000000;
    const y = d3.scaleLinear().domain([0, maxVal * 1.1]).range([height - margin.bottom, margin.top]);

    svg.append('g').attr('class', 'grid').attr('opacity', 0.08).attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(4).tickSize(-width + margin.left + margin.right).tickFormat(() => ''));

    const monthGroups = svg.append('g').selectAll('g').data(data).enter().append('g')
      .attr('transform', d => `translate(${x0(d.month)},0)`)
      .on('mouseenter', (_, d) => this.hoveredData.set(d))
      .on('mouseleave', () => this.hoveredData.set(null));

    monthGroups.append('rect')
      .attr('x', () => x1('inflow') || 0).attr('y', d => y(d.inflow))
      .attr('width', x1.bandwidth()).attr('height', d => height - margin.bottom - y(d.inflow))
      .attr('fill', '#10b981').attr('rx', 3);

    monthGroups.append('rect')
      .attr('x', () => x1('outflow') || 0).attr('y', d => y(d.outflow))
      .attr('width', x1.bandwidth()).attr('height', d => height - margin.bottom - y(d.outflow))
      .attr('fill', '#f43f5e').attr('rx', 3);

    svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickSize(0))
      .call(g => g.select('.domain').attr('stroke', '#e2e8f0'))
      .call(g => g.selectAll('text').attr('fill', '#64748b').attr('font-size', '10px').attr('dy', '10px'));
  }
}
