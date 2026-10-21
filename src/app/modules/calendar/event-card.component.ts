import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommunityEvent, RsvpStatus } from '../../shared/models/calendar.model';
import { currentUser } from '../../core/auth/auth.service';

@Component({
  selector: 'app-event-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div class="flex items-start justify-between gap-2 mb-3">
          <span [class]="categoryClass()" class="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase">{{ event().category }}</span>
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            <mat-icon class="text-sm">calendar_today</mat-icon>{{ event().startDate }}
          </span>
        </div>

        <h3 class="text-base font-bold text-slate-900 line-clamp-1 mb-1">{{ event().title }}</h3>
        <p class="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{{ event().description }}</p>

        <div class="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div class="flex items-center gap-2">
            <mat-icon class="text-slate-400 text-sm">schedule</mat-icon><span>{{ event().startTime }} - {{ event().endTime }} WIB</span>
          </div>
          <div class="flex items-center gap-2">
            <mat-icon class="text-slate-400 text-sm">{{ event().isOnline ? 'videocam' : 'place' }}</mat-icon><span class="line-clamp-1">{{ event().location }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs mb-4">
          <div class="flex items-center gap-1.5">
            <div class="flex -space-x-1.5 overflow-hidden">
              @for (att of goingAttendees().slice(0, 4); track att.memberId) {
                <img [src]="att.avatarUrl" [alt]="att.memberName" class="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" />
              }
            </div>
            <span class="text-slate-600 font-medium text-[11px]"><strong>{{ goingAttendees().length }}</strong> Hadir / {{ event().maxCapacity }} Kuota</span>
          </div>
          <div class="flex items-center gap-1">
            @if (userRsvpStatus() === 'going') {
              <button type="button" (click)="openCertificate.emit(event())" title="Cetak Sertifikat Partisipasi" class="text-amber-500 hover:text-amber-600 p-1">
                <mat-icon class="text-base">workspace_premium</mat-icon>
              </button>
            }
            <button type="button" (click)="triggerReminder.emit(event())" title="Tes Notifikasi" class="text-slate-400 hover:text-indigo-600 p-1">
              <mat-icon class="text-base">notifications_active</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button type="button" (click)="openExport.emit(event())" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1">
          <mat-icon class="text-sm text-indigo-600">sync</mat-icon><span>Sinkron</span>
        </button>

        <button type="button" (click)="openRsvp.emit(event())" [class]="userRsvpStatus() === 'going' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'" class="px-4 py-1.5 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5">
          <mat-icon class="text-sm">{{ userRsvpStatus() === 'going' ? 'check' : 'how_to_reg' }}</mat-icon>
          <span>{{ userRsvpStatus() === 'going' ? 'Sudah RSVP' : 'RSVP Sekarang' }}</span>
        </button>
      </div>
    </div>
  `
})
export class EventCardComponent {
  event = input.required<CommunityEvent>();
  openExport = output<CommunityEvent>();
  openRsvp = output<CommunityEvent>();
  openCertificate = output<CommunityEvent>();
  triggerReminder = output<CommunityEvent>();

  user = currentUser;

  goingAttendees = computed(() => this.event().attendees.filter(a => a.status === 'going'));
  userRsvpStatus = computed<RsvpStatus | null>(() => this.event().attendees.find(a => a.memberId === this.user().id)?.status || null);

  categoryClass = computed(() => {
    switch (this.event().category) {
      case 'gathering': return 'bg-amber-100 text-amber-800';
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'rapat': return 'bg-purple-100 text-purple-800';
      case 'sosial': return 'bg-emerald-100 text-emerald-800';
      case 'olahraga': return 'bg-orange-100 text-orange-800';
      default: return 'bg-indigo-100 text-indigo-800';
    }
  });
}
