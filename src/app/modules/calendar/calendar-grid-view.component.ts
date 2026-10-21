import { ChangeDetectionStrategy, Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommunityEvent } from '../../shared/models/calendar.model';

@Component({
  selector: 'app-calendar-grid-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <mat-icon class="text-indigo-600">calendar_month</mat-icon>
          <h2 class="font-bold text-slate-900 text-sm">Oktober - November 2026</h2>
        </div>
        <span class="text-xs text-slate-500 font-medium">{{ events().length }} Kegiatan Terjadwal</span>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 mb-2">
        <span>MIN</span><span>SEN</span><span>SEL</span><span>RAB</span><span>KAM</span><span>JUM</span><span>SAB</span>
      </div>

      <!-- Calendar day cells -->
      <div class="grid grid-cols-7 gap-1.5">
        @for (day of calendarDays(); track day.date) {
          <div
            [class]="day.hasEvent ? 'bg-indigo-50/70 border-indigo-200' : 'bg-slate-50 border-slate-100 text-slate-400'"
            class="min-h-[64px] p-1.5 rounded-xl border flex flex-col justify-between transition-all"
          >
            <div class="flex items-center justify-between">
              <span [class]="day.isToday ? 'bg-indigo-600 text-white font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px]' : 'text-xs font-semibold text-slate-700'">
                {{ day.dayNumber }}
              </span>
              @if (day.events.length > 0) {
                <span class="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
              }
            </div>

            <div class="space-y-0.5">
              @for (evt of day.events; track evt.id) {
                <button
                  type="button"
                  (click)="onSelectEvent($event, evt)"
                  class="w-full text-left text-[9px] font-bold px-1 py-0.5 rounded bg-indigo-600 text-white truncate block hover:opacity-90 cursor-pointer"
                  [title]="evt.title"
                >
                  {{ evt.title }}
                </button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CalendarGridViewComponent {
  events = input.required<CommunityEvent[]>();
  selectEvent = output<CommunityEvent>();

  selectedDate = signal<string | null>(null);

  calendarDays = computed(() => {
    const list = this.events();
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const dayStr = i < 10 ? `0${i}` : `${i}`;
      const fullDate = `2026-10-${dayStr}`;
      const dayEvents = list.filter(e => e.startDate === fullDate);
      days.push({
        date: fullDate,
        dayNumber: i,
        isToday: i === 15,
        hasEvent: dayEvents.length > 0,
        events: dayEvents
      });
    }
    for (let i = 1; i <= 4; i++) {
      const fullDate = `2026-11-0${i}`;
      const dayEvents = list.filter(e => e.startDate === fullDate);
      days.push({
        date: fullDate,
        dayNumber: i,
        isToday: false,
        hasEvent: dayEvents.length > 0,
        events: dayEvents
      });
    }
    return days;
  });

  selectDay(date: string): void {
    this.selectedDate.set(date);
  }

  onSelectEvent(e: Event, evt: CommunityEvent): void {
    e.stopPropagation();
    this.selectEvent.emit(evt);
  }
}
