import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CalendarHeaderComponent } from './calendar-header.component';
import { EventCardComponent } from './event-card.component';
import { CalendarGridViewComponent } from './calendar-grid-view.component';
import { EventRsvpModalComponent } from './event-rsvp-modal.component';
import { EventFormModalComponent } from './event-form-modal.component';
import { EventCalendarExportMenuComponent } from './event-calendar-export-menu.component';
import { EventCertificateModalComponent } from './event-certificate-modal.component';
import { CalendarBulkSyncModalComponent } from './calendar-bulk-sync-modal.component';
import { CommunityEvent, EventCategory, RsvpStatus } from '../../shared/models/calendar.model';
import { eventFilter, filteredEvents, addCommunityEvent, submitEventRsvp, triggerEventReminder } from '../../core/events/events.service';

@Component({
  selector: 'app-calendar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatIconModule, CalendarHeaderComponent, EventCardComponent,
    CalendarGridViewComponent, EventRsvpModalComponent, EventFormModalComponent,
    EventCalendarExportMenuComponent, EventCertificateModalComponent, CalendarBulkSyncModalComponent
  ],
  template: `
    <div class="space-y-6">
      <app-calendar-header
        [filter]="filter()"
        (viewModeChange)="onViewModeChange($event)"
        (categoryChange)="onCategoryChange($event)"
        (searchChange)="onSearchChange($event)"
        (createEvent)="isCreateModalOpen.set(true)"
        (bulkSync)="isBulkSyncOpen.set(true)"
      />

      @if (filter().viewMode === 'month') {
        <app-calendar-grid-view [events]="events()" (selectEvent)="onOpenRsvp($event)" />
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (evt of events(); track evt.id) {
            <app-event-card
              [event]="evt"
              (openExport)="onOpenExport(evt)"
              (openRsvp)="onOpenRsvp(evt)"
              (openCertificate)="activeCertEvent.set(evt)"
              (triggerReminder)="onTriggerReminder(evt)"
            />
          } @empty {
            <div class="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200">
              <mat-icon class="text-4xl text-slate-300 mb-2">event_busy</mat-icon>
              <h3 class="font-bold text-slate-700 text-sm">Tidak ada kegiatan ditemukan</h3>
              <p class="text-xs text-slate-400 mt-1">Coba sesuaikan filter pencarian atau buat kegiatan baru.</p>
            </div>
          }
        </div>
      }

      @if (activeExportEvent()) { <app-event-calendar-export-menu [event]="activeExportEvent()!" (menuClose)="activeExportEvent.set(null)" /> }
      @if (activeRsvpEvent()) { <app-event-rsvp-modal [event]="activeRsvpEvent()!" (modalClose)="activeRsvpEvent.set(null)" (submitRsvp)="onSubmitRsvp($event)" /> }
      @if (activeCertEvent()) { <app-event-certificate-modal [event]="activeCertEvent()!" (modalClose)="activeCertEvent.set(null)" /> }
      @if (isCreateModalOpen()) { <app-event-form-modal (modalClose)="isCreateModalOpen.set(false)" (save)="onSaveEvent($event)" /> }
      @if (isBulkSyncOpen()) { <app-calendar-bulk-sync-modal [events]="events()" (modalClose)="isBulkSyncOpen.set(false)" /> }
    </div>
  `
})
export class CalendarPageComponent {
  events = filteredEvents;
  filter = eventFilter;

  isCreateModalOpen = signal<boolean>(false);
  isBulkSyncOpen = signal<boolean>(false);
  activeExportEvent = signal<CommunityEvent | null>(null);
  activeRsvpEvent = signal<CommunityEvent | null>(null);
  activeCertEvent = signal<CommunityEvent | null>(null);

  onViewModeChange(mode: 'agenda' | 'month' | 'my-rsvps'): void { this.filter.update(f => ({ ...f, viewMode: mode })); }
  onCategoryChange(cat: 'all' | EventCategory): void { this.filter.update(f => ({ ...f, category: cat })); }
  onSearchChange(term: string): void { this.filter.update(f => ({ ...f, search: term })); }
  onOpenExport(evt: CommunityEvent): void { this.activeExportEvent.set(evt); }
  onOpenRsvp(evt: CommunityEvent): void { this.activeRsvpEvent.set(evt); }
  onTriggerReminder(evt: CommunityEvent): void { triggerEventReminder(evt); }

  onSubmitRsvp(payload: { status: RsvpStatus; notes?: string }): void {
    const cur = this.activeRsvpEvent();
    if (cur) {
      submitEventRsvp(cur.id, payload.status, payload.notes);
      this.activeRsvpEvent.set(null);
    }
  }

  onSaveEvent(data: Omit<CommunityEvent, 'id' | 'createdAt' | 'attendees'>): void {
    addCommunityEvent(data);
    this.isCreateModalOpen.set(false);
  }
}
