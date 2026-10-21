import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivisionMatchDatum } from './division-match-data';

@Component({
  selector: 'app-division-match-bar-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="w-full overflow-x-auto select-none">
      <svg viewBox="0 0 540 210" class="w-full max-w-full h-auto text-xs overflow-visible">
        <!-- Horizontal Grid lines -->
        @for (tick of [100, 75, 50, 25]; track tick) {
          <line x1="40" [attr.y1]="170 - (tick * 1.3)" x2="520" [attr.y2]="170 - (tick * 1.3)" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
          <text x="32" [attr.y]="174 - (tick * 1.3)" text-anchor="end" fill="#94a3b8" font-size="9" font-weight="600">{{ tick }}%</text>
        }
        <line x1="40" y1="170" x2="520" y2="170" stroke="#cbd5e1" stroke-width="1" />

        <!-- Bars -->
        @for (item of barLayout(); track item.data.id) {
          <g
            class="cursor-pointer group"
            (mouseenter)="hoverChange.emit(item.data)"
            (mouseleave)="hoverChange.emit(null)"
            (click)="selectDivision.emit(item.data.id)"
          >
            <!-- Recharts-style Active Column Background -->
            @if (hoveredId() === item.data.id) {
              <rect [attr.x]="item.x - 8" y="28" [attr.width]="item.width + 16" height="152" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
            }
            <!-- Bar Background Track -->
            <rect [attr.x]="item.x" y="40" [attr.width]="item.width" height="130" rx="6" fill="#f1f5f9" />
            <!-- Bar Fill with active lift -->
            <rect
              [attr.x]="item.x"
              [attr.y]="item.y"
              [attr.width]="item.width"
              [attr.height]="item.height"
              rx="6"
              [attr.fill]="item.data.color"
              [attr.stroke]="hoveredId() === item.data.id ? '#ffffff' : 'none'"
              stroke-width="2"
              class="transition-all duration-300 group-hover:brightness-110"
            />
            <!-- Score Value Badge on top -->
            <text
              [attr.x]="item.x + item.width / 2"
              [attr.y]="item.y - 6"
              text-anchor="middle"
              [attr.fill]="item.data.color"
              font-size="10"
              font-weight="bold"
            >{{ item.data.avgScore }}%</text>
            <!-- X Axis Short Label -->
            <text
              [attr.x]="item.x + item.width / 2"
              y="188"
              text-anchor="middle"
              [attr.fill]="hoveredId() === item.data.id ? '#1e293b' : '#64748b'"
              font-size="10"
              [attr.font-weight]="hoveredId() === item.data.id ? 'bold' : '600'"
            >{{ item.data.shortLabel }}</text>
            <!-- Candidate count subtext -->
            <text
              [attr.x]="item.x + item.width / 2"
              y="201"
              text-anchor="middle"
              fill="#94a3b8"
              font-size="9"
            >{{ item.data.count }} org</text>
          </g>
        }
      </svg>
    </div>
  `
})
export class DivisionMatchBarViewComponent {
  data = input.required<DivisionMatchDatum[]>();
  hoveredId = input<string | null>(null);
  hoverChange = output<DivisionMatchDatum | null>();
  selectDivision = output<string>();

  barLayout = computed(() => {
    const list = this.data();
    const count = list.length || 1;
    const startX = 55;
    const availableW = 450;
    const step = availableW / count;
    const barW = Math.min(46, step * 0.65);

    return list.map((d, i) => {
      const h = Math.max(4, (d.avgScore / 100) * 130);
      return {
        data: d,
        x: startX + i * step + (step - barW) / 2,
        y: 170 - h,
        width: barW,
        height: h
      };
    });
  });
}
