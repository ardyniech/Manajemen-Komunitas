import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TeamCharacterConflict } from './team-conflict-detector';

@Component({
  selector: 'app-team-conflict-warning',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (conflicts().length > 0) {
      <div class="p-3.5 bg-rose-50/80 border border-rose-200/90 rounded-2xl space-y-2 text-xs animate-in fade-in">
        <div class="flex items-center justify-between pb-1.5 border-b border-rose-200/60">
          <div class="flex items-center gap-1.5 font-bold text-rose-950">
            <mat-icon class="text-rose-600 text-sm">warning</mat-icon>
            <span>Peringatan Konflik Karakter Tim Terdeteksi ({{ conflicts().length }})</span>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
            Mitigasi Wajib
          </span>
        </div>

        <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
          @for (c of conflicts(); track c.title + c.colleagueId) {
            <div class="p-2.5 bg-white/90 rounded-xl border border-rose-100 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 text-[11px]">{{ c.title }}</span>
                <span class="text-[9px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                  Dengan: {{ c.colleagueName }}
                </span>
              </div>
              <p class="text-[10px] text-slate-600 leading-relaxed">{{ c.description }}</p>
              <div class="text-[10px] text-amber-900 bg-amber-50/80 p-1.5 rounded-lg flex items-start gap-1">
                <mat-icon class="text-xs text-amber-600 shrink-0 mt-0.5">lightbulb</mat-icon>
                <span><strong>Saran Dewan Etik:</strong> {{ c.mitigationAdvice }}</span>
              </div>
              @if (c.suggestedMediator) {
                <div class="text-[10px] text-teal-900 bg-teal-50/80 p-1.5 rounded-lg flex items-center gap-1 border border-teal-200/50">
                  <mat-icon class="text-xs text-teal-600 shrink-0">handshake</mat-icon>
                  <span><strong>Penengah Disarankan:</strong> {{ c.suggestedMediator }}</span>
                </div>
              }
            </div>
          }
        </div>
      </div>
    }
  `
})
export class TeamConflictWarningComponent {
  conflicts = input.required<TeamCharacterConflict[]>();
}
