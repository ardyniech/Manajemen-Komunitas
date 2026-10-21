import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommunityEvent } from '../../shared/models/calendar.model';
import { downloadIcsFile, generateGoogleCalendarUrl, generateOutlookCalendarUrl } from '../../shared/utils/calendar-export';

@Component({
  selector: 'app-event-calendar-export-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <mat-icon class="text-lg">sync</mat-icon>
            </span>
            <h3 class="font-bold text-slate-800 text-sm">Sinkron Kalender Pribadi</h3>
          </div>
          <button type="button" (click)="menuClose.emit()" class="text-slate-400 hover:text-slate-600 p-1">
            <mat-icon class="text-lg">close</mat-icon>
          </button>
        </div>

        <p class="text-xs text-slate-500 my-3">
          Tambahkan jadwal <strong>{{ event().title }}</strong> langsung ke aplikasi kalender harian Anda:
        </p>

        <div class="space-y-2">
          <!-- Google Calendar -->
          <a
            [href]="googleUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all text-xs font-semibold text-slate-700 group"
          >
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">G</span>
              <span>Google Calendar</span>
            </div>
            <mat-icon class="text-slate-400 group-hover:text-indigo-600 text-base">open_in_new</mat-icon>
          </a>

          <!-- Outlook Calendar -->
          <a
            [href]="outlookUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 transition-all text-xs font-semibold text-slate-700 group"
          >
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs">O</span>
              <span>Outlook Calendar (Web)</span>
            </div>
            <mat-icon class="text-slate-400 group-hover:text-sky-600 text-base">open_in_new</mat-icon>
          </a>

          <!-- Apple / iCal (.ics) -->
          <button
            type="button"
            (click)="onDownloadIcs()"
            class="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all text-xs font-semibold text-slate-700 group text-left"
          >
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">ICS</span>
              <div>
                <span>Unduh Berkas iCalendar (.ics)</span>
                <span class="block text-[10px] text-slate-400 font-normal">Apple Calendar, Thunderbird, Android</span>
              </div>
            </div>
            <mat-icon class="text-slate-400 group-hover:text-emerald-600 text-base">file_download</mat-icon>
          </button>
        </div>

        @if (downloadDone()) {
          <div class="mt-3 p-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs flex items-center gap-1.5">
            <mat-icon class="text-sm">check_circle</mat-icon>
            <span>Berkas .ics berhasil diunduh!</span>
          </div>
        }

        <div class="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            (click)="menuClose.emit()"
            class="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  `
})
export class EventCalendarExportMenuComponent {
  event = input.required<CommunityEvent>();
  menuClose = output<void>();
  downloadDone = signal<boolean>(false);

  googleUrl(): string {
    return generateGoogleCalendarUrl(this.event());
  }

  outlookUrl(): string {
    return generateOutlookCalendarUrl(this.event());
  }

  onDownloadIcs(): void {
    downloadIcsFile(this.event());
    this.downloadDone.set(true);
    setTimeout(() => this.downloadDone.set(false), 3000);
  }
}
