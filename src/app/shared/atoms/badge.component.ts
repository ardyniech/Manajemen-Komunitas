import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight whitespace-nowrap ' +
        variantClass()
      "
    >
      <span class="w-1.5 h-1.5 rounded-full" [class]="dotClass()"></span>
      <ng-content></ng-content>
    </span>
  `
})
export class AppBadge {
  variant = input<'success' | 'warning' | 'danger' | 'info' | 'neutral'>('info');

  variantClass(): string {
    switch (this.variant()) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'danger':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'neutral':
        return 'bg-slate-100 text-slate-700 border border-slate-200/60';
      default:
        return 'bg-blue-50 text-blue-700 border border-blue-200/60';
    }
  }

  dotClass(): string {
    switch (this.variant()) {
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-rose-500';
      case 'neutral':
        return 'bg-slate-400';
      default:
        return 'bg-blue-500';
    }
  }
}
