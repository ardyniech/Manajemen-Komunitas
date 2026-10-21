import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PointActivity } from '../../shared/models/gamification.model';

@Component({
  selector: 'app-point-history-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <mat-icon class="text-indigo-600 text-lg">history</mat-icon>
            <span>Riwayat Perolehan Poin (XP)</span>
          </h3>
          <p class="text-xs text-slate-500">Aktivitas terbaru yang memberikan poin kontribusi</p>
        </div>
      </div>

      <div class="space-y-3">
        @for (act of history(); track act.id) {
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-all">
            <div class="flex items-center gap-3">
              <span [class]="getActionColor(act.actionType)" class="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0">
                <mat-icon class="text-sm">{{ getActionIcon(act.actionType) }}</mat-icon>
              </span>
              <div>
                <h4 class="text-xs font-bold text-slate-800">{{ act.title }}</h4>
                <p class="text-[11px] text-slate-500">{{ act.description }}</p>
                <span class="text-[10px] text-slate-400 font-medium">{{ act.createdAt }}</span>
              </div>
            </div>

            <div class="text-right shrink-0">
              <span class="inline-flex items-center font-black text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                +{{ act.points }} XP
              </span>
            </div>
          </div>
        } @empty {
          <div class="py-8 text-center text-slate-400 text-xs">
            Belum ada catatan aktivitas poin.
          </div>
        }
      </div>
    </div>
  `
})
export class PointHistoryListComponent {
  history = input.required<PointActivity[]>();

  getActionIcon(type: string): string {
    switch (type) {
      case 'dues_paid': return 'payments';
      case 'forum_post': return 'chat';
      case 'referral': return 'group_add';
      case 'event_rsvp': return 'event_available';
      default: return 'stars';
    }
  }

  getActionColor(type: string): string {
    switch (type) {
      case 'dues_paid': return 'bg-emerald-600';
      case 'forum_post': return 'bg-blue-600';
      case 'referral': return 'bg-purple-600';
      case 'event_rsvp': return 'bg-amber-600';
      default: return 'bg-indigo-600';
    }
  }
}
