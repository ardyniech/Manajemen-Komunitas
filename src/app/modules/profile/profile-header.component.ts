import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthUser } from '../../shared/models/auth.model';
import { updateAuthProfile } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <!-- Avatar with change trigger -->
        <div class="relative group">
          <img [src]="user().avatarUrl" class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-sm" alt="Foto Profil" referrerpolicy="no-referrer" />
          <button type="button" (click)="showAvatarPicker.set(!showAvatarPicker())" title="Ganti Avatar" class="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md hover:bg-indigo-600 transition-all">
            <mat-icon class="text-sm">photo_camera</mat-icon>
          </button>
        </div>

        <!-- Identity & Status Badges -->
        <div class="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 truncate">{{ user().fullName }}</h2>
            <span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">{{ user().roleTitle }}</span>
            <span class="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">{{ user().tier }}</span>
          </div>

          <p class="text-xs text-slate-500 font-mono flex items-center justify-center sm:justify-start gap-1">
            <mat-icon class="text-sm text-slate-400">badge</mat-icon>
            <span>No. Anggota: {{ user().memberNumber }}</span>
          </p>

          <p class="text-xs text-slate-600 max-w-xl">{{ user().bio }}</p>
        </div>

        <!-- Quick Action Trigger -->
        <div class="flex sm:flex-col gap-2 shrink-0">
          <button type="button" (click)="activeTabChange.emit('kta')" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-sm text-amber-400">credit_card</mat-icon>
            <span>Lihat KTA</span>
          </button>
        </div>
      </div>

      <!-- Avatar Preset Picker Popover -->
      @if (showAvatarPicker()) {
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <span class="text-[11px] font-bold text-slate-700 block">Pilih Avatar Preset atau URL Kustom:</span>
          <div class="flex flex-wrap gap-2">
            @for (preset of avatarPresets; track preset) {
              <button type="button" (click)="selectAvatar(preset)" class="rounded-xl overflow-hidden hover:ring-2 ring-indigo-600 transition-all focus:outline-none">
                <img [src]="preset" class="w-10 h-10 object-cover" alt="Preset Avatar" referrerpolicy="no-referrer" />
              </button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class ProfileHeaderComponent {
  user = input.required<AuthUser>();
  activeTabChange = output<'biodata' | 'custom-data' | 'kta' | 'security'>();
  showAvatarPicker = signal(false);

  avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  ];

  selectAvatar(url: string): void {
    updateAuthProfile({ avatarUrl: url });
    this.showAvatarPicker.set(false);
  }
}
