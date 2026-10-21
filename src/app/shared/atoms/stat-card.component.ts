import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppInfoTooltip } from './info-tooltip.component';

@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, AppInfoTooltip],
  template: `
    <div
      class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{{ label() }}</span>
          @if (infoTooltip()) {
            <app-info-tooltip
              [text]="infoTooltip()"
              [title]="infoTitle() || label()"
              position="top"
            />
          }
        </div>
        <div
          [class]="'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + iconBgClass()"
        >
          <mat-icon [class]="iconColorClass()" class="text-xl leading-none">{{ icon() }}</mat-icon>
        </div>
      </div>
      <div>
        <div class="text-2xl font-bold tracking-tight text-slate-900 mb-1">{{ value() }}</div>
        @if (subtext()) {
          <div class="text-xs font-medium text-slate-500 flex items-center gap-1">
            @if (trend()) {
              <span
                [class]="trend() === 'up' ? 'text-emerald-600' : 'text-rose-600'"
                class="font-semibold inline-flex items-center"
              >
                <mat-icon class="text-sm scale-75">{{ trend() === 'up' ? 'trending_up' : 'trending_down' }}</mat-icon>
                {{ trendValue() }}
              </span>
            }
            <span>{{ subtext() }}</span>
          </div>
        }
      </div>
    </div>
  `
})
export class AppStatCard {
  label = input.required<string>();
  value = input.required<string>();
  icon = input.required<string>();
  infoTooltip = input<string>('');
  infoTitle = input<string>('');
  subtext = input<string>('');
  trend = input<'up' | 'down' | null>(null);
  trendValue = input<string>('');
  tone = input<'indigo' | 'emerald' | 'amber' | 'rose' | 'slate'>('indigo');

  iconBgClass(): string {
    switch (this.tone()) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-600';
      case 'amber':
        return 'bg-amber-50 text-amber-600';
      case 'rose':
        return 'bg-rose-50 text-rose-600';
      case 'slate':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-indigo-50 text-indigo-600';
    }
  }

  iconColorClass(): string {
    switch (this.tone()) {
      case 'emerald':
        return 'text-emerald-600';
      case 'amber':
        return 'text-amber-600';
      case 'rose':
        return 'text-rose-600';
      case 'slate':
        return 'text-slate-600';
      default:
        return 'text-indigo-600';
    }
  }
}
