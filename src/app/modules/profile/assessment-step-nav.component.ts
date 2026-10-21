import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-assessment-step-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
      <button type="button" (click)="prev.emit()" [disabled]="currentStep() === 1" class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40">
        Sebelumnya
      </button>

      @if (currentStep() < 3) {
        <button type="button" (click)="next.emit()" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1">
          <span>Lanjut</span><mat-icon class="text-sm">arrow_forward</mat-icon>
        </button>
      } @else {
        <button type="button" (click)="submitForm.emit()" [disabled]="isSubmitting() || isInvalid()" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50">
          <mat-icon class="text-sm">cloud_upload</mat-icon>
          <span>{{ isSubmitting() ? 'Memproses Server...' : 'Kirim via Backend (+50 XP)' }}</span>
        </button>
      }
    </div>
  `
})
export class AssessmentStepNavComponent {
  currentStep = input.required<number>();
  isSubmitting = input.required<boolean>();
  isInvalid = input.required<boolean>();
  prev = output<void>();
  next = output<void>();
  submitForm = output<void>();
}
