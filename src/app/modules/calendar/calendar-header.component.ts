import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EventCategory, EventFilterState } from '../../shared/models/calendar.model';

@Component({
  selector: 'app-calendar-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="p-2 rounded-xl bg-indigo-50 text-indigo-600"><mat-icon class="text-2xl">event</mat-icon></span>
          <div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">Kalender & Agenda Komunitas</h1>
            <p class="text-xs text-slate-500">Jadwal kegiatan, temu warga, workshop, dan sinkronisasi agenda pribadi</p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
            <button type="button" (click)="viewModeChange.emit('agenda')" [class]="filter().viewMode === 'agenda' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'hover:text-slate-900'" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
              <mat-icon class="text-sm">view_agenda</mat-icon><span>Agenda</span>
            </button>
            <button type="button" (click)="viewModeChange.emit('month')" [class]="filter().viewMode === 'month' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'hover:text-slate-900'" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
              <mat-icon class="text-sm">calendar_month</mat-icon><span>Kalender</span>
            </button>
            <button type="button" (click)="viewModeChange.emit('my-rsvps')" [class]="filter().viewMode === 'my-rsvps' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'hover:text-slate-900'" class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
              <mat-icon class="text-sm">how_to_reg</mat-icon><span>RSVP Saya</span>
            </button>
          </div>
          <button type="button" (click)="bulkSync.emit()" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0">
            <mat-icon class="text-base text-indigo-400">sync</mat-icon><span>Sinkronkan Semua</span>
          </button>
          <button type="button" (click)="createEvent.emit()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all shrink-0">
            <mat-icon class="text-base">add</mat-icon><span>Tambah Agenda</span>
          </button>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button type="button" (click)="categoryChange.emit('all')" [class]="filter().category === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0">Semua</button>
          <button type="button" (click)="categoryChange.emit('gathering')" [class]="filter().category === 'gathering' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'" class="px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0">Gathering</button>
          <button type="button" (click)="categoryChange.emit('workshop')" [class]="filter().category === 'workshop' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'" class="px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0">Workshop</button>
          <button type="button" (click)="categoryChange.emit('rapat')" [class]="filter().category === 'rapat' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'" class="px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0">Rapat Pleno</button>
          <button type="button" (click)="categoryChange.emit('sosial')" [class]="filter().category === 'sosial' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'" class="px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0">Bakti Sosial</button>
        </div>
        <div class="relative w-full sm:w-64">
          <mat-icon class="absolute left-3 top-2.5 text-slate-400 text-sm">search</mat-icon>
          <input type="text" placeholder="Cari kegiatan atau lokasi..." [value]="filter().search" (input)="onSearchInput($event)" class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
      </div>
    </div>
  `
})
export class CalendarHeaderComponent {
  filter = input.required<EventFilterState>();
  createEvent = output<void>();
  bulkSync = output<void>();
  viewModeChange = output<'agenda' | 'month' | 'my-rsvps'>();
  categoryChange = output<'all' | EventCategory>();
  searchChange = output<string>();

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchChange.emit(val);
  }
}
