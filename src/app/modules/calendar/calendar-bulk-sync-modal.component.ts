import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommunityEvent } from '../../shared/models/calendar.model';
import { downloadAllEventsIcs } from '../../shared/utils/calendar-export';

@Component({
  selector: 'app-calendar-bulk-sync-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <span class="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <mat-icon class="text-xl">calendar_month</mat-icon>
            </span>
            <div>
              <h3 class="font-extrabold text-slate-900 text-sm">Sinkronisasi Semua Kalender Komunitas</h3>
              <p class="text-[11px] text-slate-500">Ekspor seluruh {{ events().length }} jadwal acara komunitas sekaligus</p>
            </div>
          </div>
          <button type="button" (click)="modalClose.emit()" class="text-slate-400 hover:text-slate-600 p-1">
            <mat-icon class="text-lg">close</mat-icon>
          </button>
        </div>

        <div class="space-y-3 text-xs text-slate-600">
          <div class="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
            <div class="font-bold text-indigo-900 flex items-center gap-1.5">
              <mat-icon class="text-sm">info</mat-icon><span>Integrasi Kalender Pribadi</span>
            </div>
            <p class="text-[11px] text-indigo-800 leading-relaxed">
              Anda dapat mengunduh seluruh jadwal acara komunitas dalam satu berkas terpadu (.ics) untuk diimpor ke Google Calendar, Outlook, Apple Calendar, atau Android Calendar.
            </p>
          </div>

          <div class="space-y-2 pt-1">
            <button
              type="button"
              (click)="onDownloadAll()"
              class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <mat-icon class="text-sm">file_download</mat-icon>
              <span>Unduh Berkas ICS Komunitas Lengkap ({{ events().length }} Acara)</span>
            </button>

            <a
              href="https://calendar.google.com/calendar/u/0/r/settings/export"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-between transition-all"
            >
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">G</span>
                <span>Panduan Impor ke Google Calendar</span>
              </div>
              <mat-icon class="text-sm text-slate-400">open_in_new</mat-icon>
            </a>
          </div>

          @if (successMessage()) {
            <div class="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
              <mat-icon class="text-sm text-emerald-600">check_circle</mat-icon>
              <span>{{ successMessage() }}</span>
            </div>
          }
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            (click)="modalClose.emit()"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  `
})
export class CalendarBulkSyncModalComponent {
  events = input.required<CommunityEvent[]>();
  modalClose = output<void>();
  successMessage = signal<string>('');

  onDownloadAll(): void {
    downloadAllEventsIcs(this.events());
    this.successMessage.set('Berkas ICS seluruh acara komunitas berhasil diunduh!');
  }
}
