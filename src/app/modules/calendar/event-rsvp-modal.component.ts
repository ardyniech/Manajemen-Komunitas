import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommunityEvent, RsvpStatus } from '../../shared/models/calendar.model';
import { requestPushNotificationPermission, showEventReminderPush } from '../../shared/utils/calendar-export';

@Component({
  selector: 'app-event-rsvp-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-bold text-slate-800 text-base">Konfirmasi Kehadiran (RSVP)</h3>
            <p class="text-xs text-slate-500 line-clamp-1">{{ event().title }}</p>
          </div>
          <button type="button" (click)="modalClose.emit()" class="text-slate-400 hover:text-slate-600 p-1"><mat-icon class="text-lg">close</mat-icon></button>
        </div>

        <form [formGroup]="rsvpForm" (ngSubmit)="onSubmit()" class="mt-4 space-y-4">
          <div>
            <span class="block text-xs font-semibold text-slate-700 mb-2">Status Partisipasi:</span>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" (click)="setStatus('going')" [class]="rsvpForm.value.status === 'going' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'" class="py-2.5 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all">
                <mat-icon class="text-lg">check_circle</mat-icon><span>Pasti Hadir</span>
              </button>
              <button type="button" (click)="setStatus('maybe')" [class]="rsvpForm.value.status === 'maybe' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'" class="py-2.5 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all">
                <mat-icon class="text-lg">help</mat-icon><span>Mungkin</span>
              </button>
              <button type="button" (click)="setStatus('not_going')" [class]="rsvpForm.value.status === 'not_going' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'" class="py-2.5 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all">
                <mat-icon class="text-lg">cancel</mat-icon><span>Tidak Hadir</span>
              </button>
            </div>
          </div>

          <div>
            <label for="rsvp-notes" class="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional):</label>
            <input id="rsvp-notes" type="text" formControlName="notes" placeholder="Misal: Hadir bersama 1 keluarga" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>

          <div class="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <mat-icon class="text-indigo-600 text-base">notifications_active</mat-icon>
              <div>
                <p class="text-xs font-semibold text-slate-800">Notifikasi Pengingat</p>
                <p class="text-[10px] text-slate-500">Notifikasi push otomatis sebelum acara dimulai</p>
              </div>
            </div>
            <button type="button" (click)="togglePushNotification()" [class]="enablePush() ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all">
              {{ enablePush() ? 'Aktif' : 'Nonaktif' }}
            </button>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" (click)="modalClose.emit()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">Batal</button>
            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5">
              <mat-icon class="text-sm">save</mat-icon><span>Simpan RSVP (+25 XP)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EventRsvpModalComponent {
  event = input.required<CommunityEvent>();
  currentStatus = input<RsvpStatus>('going');
  modalClose = output<void>();
  submitRsvp = output<{ status: RsvpStatus; notes?: string }>();
  enablePush = signal<boolean>(true);

  rsvpForm = new FormGroup({
    status: new FormControl<RsvpStatus>('going', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl<string>('')
  });

  setStatus(status: RsvpStatus): void {
    this.rsvpForm.patchValue({ status });
  }

  async togglePushNotification(): Promise<void> {
    const next = !this.enablePush();
    if (next) {
      const granted = await requestPushNotificationPermission();
      this.enablePush.set(granted);
    } else {
      this.enablePush.set(false);
    }
  }

  onSubmit(): void {
    const val = this.rsvpForm.getRawValue();
    if (this.enablePush()) {
      showEventReminderPush('RSVP Dikonfirmasi!', `Pengingat untuk acara "${this.event().title}" telah disetel.`);
    }
    this.submitRsvp.emit({ status: val.status, notes: val.notes || undefined });
  }
}
