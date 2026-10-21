import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-info-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      class="relative inline-flex items-center"
      (mouseenter)="show()"
      (mouseleave)="hide()"
      (focusin)="show()"
      (focusout)="hide()"
      (click)="toggle($event)"
      tabindex="0"
      role="button"
      [attr.aria-label]="title() || text()"
    >
      <mat-icon
        [class]="iconClass()"
        class="text-[15px] w-[15px] h-[15px] leading-none text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer select-none"
      >
        {{ icon() }}
      </mat-icon>

      @if (isVisible()) {
        <div
          [class]="positionClass()"
          class="absolute z-50 w-52 sm:w-60 p-2.5 bg-slate-900/95 backdrop-blur-xs text-white text-[11px] leading-relaxed rounded-xl shadow-xl border border-slate-700/70 pointer-events-none transition-all duration-150 animate-fade-in-up"
        >
          @if (title()) {
            <div class="font-bold text-indigo-300 mb-0.5 text-xs flex items-center gap-1">
              <mat-icon class="text-xs">info</mat-icon>
              <span>{{ title() }}</span>
            </div>
          }
          <div class="text-slate-200 font-normal">
            {{ text() }}
          </div>
        </div>
      }
    </div>
  `
})
export class AppInfoTooltip {
  text = input.required<string>();
  title = input<string>('');
  icon = input<string>('help_outline');
  position = input<'top' | 'bottom' | 'left' | 'right'>('top');
  iconClass = input<string>('');

  isVisible = signal<boolean>(false);

  show(): void {
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }

  toggle(e: Event): void {
    e.stopPropagation();
    this.isVisible.update(v => !v);
  }

  positionClass(): string {
    switch (this.position()) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  }
}
