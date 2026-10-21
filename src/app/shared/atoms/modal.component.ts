import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        (keydown.escape)="dismiss.emit()"
        (click)="onBackdropClick($event)"
      >
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 class="text-base font-semibold text-slate-900">{{ title() }}</h3>
              @if (subtitle()) {
                <p class="text-xs text-slate-500 mt-0.5">{{ subtitle() }}</p>
              }
            </div>
            <button
              type="button"
              (click)="dismiss.emit()"
              class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <mat-icon class="text-lg">close</mat-icon>
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="px-6 py-5 overflow-y-auto flex-1 text-sm text-slate-700">
            <ng-content></ng-content>
          </div>

          <!-- Modal Footer (Optional) -->
          <div class="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <ng-content select="[footer]"></ng-content>
          </div>
        </div>
      </div>
    }
  `
})
export class AppModal {
  isOpen = input.required<boolean>();
  title = input.required<string>();
  subtitle = input<string>('');
  dismiss = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dismiss.emit();
    }
  }
}
