import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '../../shared/models/member.model';
import { AppModal } from '../../shared/atoms/modal.component';
import { AppBadge } from '../../shared/atoms/badge.component';
import { settingsState } from '../../shared/utils/storage';

@Component({
  selector: 'app-member-kta-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppModal, AppBadge],
  template: `
    @if (member()) {
      <app-modal [isOpen]="isOpen()" title="Kartu Tanda Anggota (KTA Digital)" subtitle="Identitas resmi keanggotaan terverifikasi" (dismiss)="modalClose.emit()">
        <div class="space-y-4">
          <!-- Digital Card Frame -->
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl border border-indigo-500/30">
            <!-- Decorative Accent Elements -->
            <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl"></div>
            <div class="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"></div>

            <!-- Card Header -->
            <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                  <mat-icon class="text-base">badge</mat-icon>
                </div>
                <div>
                  <h4 class="text-xs font-bold tracking-tight text-white">{{ settings().communityName }}</h4>
                  <p class="text-[9px] text-slate-300 font-mono tracking-widest uppercase">E-MEMBER IDENTIFICATION</p>
                </div>
              </div>
              <app-badge [variant]="member()!.status === 'aktif' ? 'success' : 'neutral'">
                {{ member()!.status | uppercase }}
              </app-badge>
            </div>

            <!-- Card Body with Avatar & Info -->
            <div class="flex items-center gap-4">
              <img
                [src]="member()!.avatarUrl"
                class="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/40 shadow-md"
                alt="Avatar"
                referrerpolicy="no-referrer"
              />
              <div class="min-w-0 flex-1">
                <p class="text-base font-bold text-white truncate">{{ member()!.fullName }}</p>
                <p class="text-xs text-indigo-200 font-mono tracking-wider">{{ member()!.memberNumber }}</p>
                <div class="flex items-center gap-2 mt-1 text-[11px] text-slate-300">
                  <span class="capitalize">{{ member()!.tier }}</span>
                  <span>•</span>
                  <span>Gabung {{ member()!.joinedAt }}</span>
                </div>
              </div>
            </div>

            <!-- QR Code Simulation Matrix -->
            <div class="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <p class="text-[9px] text-slate-400 uppercase tracking-wider">Iuran Berlaku Hingga</p>
                <p class="text-xs font-semibold text-emerald-400 font-mono">{{ member()!.duesPaidUntil }}</p>
              </div>

              <!-- SVG Stylized Barcode / Mini QR Block -->
              <div class="bg-white p-1.5 rounded-lg flex items-center gap-1 shadow-xs">
                <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="8" height="8" rx="1" fill="#0f172a" />
                  <rect x="14" y="2" width="8" height="8" rx="1" fill="#0f172a" />
                  <rect x="2" y="14" width="8" height="8" rx="1" fill="#0f172a" />
                  <rect x="14" y="14" width="4" height="4" fill="#4f46e5" />
                  <rect x="18" y="18" width="4" height="4" fill="#0f172a" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              (click)="printCard()"
              class="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 inline-flex items-center gap-1.5"
            >
              <mat-icon class="text-sm">print</mat-icon> Cetak KTA
            </button>
            <button
              type="button"
              (click)="modalClose.emit()"
              class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            >
              Tutup
            </button>
          </div>
        </div>
      </app-modal>
    }
  `
})
export class MemberKtaModalComponent {
  isOpen = input.required<boolean>();
  member = input<Member | null>(null);
  modalClose = output<void>();
  settings = settingsState;

  printCard(): void {
    window.print();
  }
}
