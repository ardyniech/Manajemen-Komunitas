import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { notificationsState } from '../../shared/utils/storage';
import { AppNotification } from '../../shared/models/common.model';
import { dispatcher } from '../dispatcher';

@Component({
  selector: 'app-notification-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-2xs flex justify-end"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        (keydown.escape)="drawerClose.emit()"
        (click)="onBackdrop($event)"
      >
        <div class="w-full max-w-sm bg-white h-full shadow-2xl p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-indigo-600">notifications_active</mat-icon>
                <h3 class="font-bold text-slate-900 text-sm">Pusat Notifikasi Real-time</h3>
              </div>
              <button
                type="button"
                (click)="drawerClose.emit()"
                class="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <mat-icon class="text-base">close</mat-icon>
              </button>
            </div>

            <div class="space-y-2.5 max-h-[70vh] overflow-y-auto">
              @for (n of notifications(); track n.id) {
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div class="flex items-center justify-between font-semibold text-slate-900 mb-0.5">
                    <span>{{ n.title }}</span>
                    <span class="text-[10px] text-slate-400 font-normal">{{ n.timestamp }}</span>
                  </div>
                  <p class="text-slate-600 text-[11px] leading-relaxed">{{ n.message }}</p>
                </div>
              }
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100">
            <button
              type="button"
              (click)="simulateRealtimePush()"
              class="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center justify-center gap-2"
            >
              <mat-icon class="text-sm">bolt</mat-icon> Simulasi Push Notifikasi Baru
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class NotificationDrawerComponent {
  isOpen = input.required<boolean>();
  drawerClose = output<void>();
  notifications = notificationsState;

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.drawerClose.emit();
    }
  }

  simulateRealtimePush(): void {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Pembayaran Iuran Diterima',
      message: 'Anggota Anisa Larasati telah melunasi iuran kas sebesar Rp 50.000 via Transfer Bank.',
      type: 'payment',
      timestamp: 'Baru saja',
      read: false
    };
    notificationsState.update(list => [newNotif, ...list]);
    dispatcher.emit('NOTIFICATION_PUSHED', newNotif, 'notification-drawer');
  }
}
