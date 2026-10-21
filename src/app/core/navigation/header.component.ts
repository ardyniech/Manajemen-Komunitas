import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { currentLanguage, setAppLanguage } from '../i18n';
import { notificationsState, restoreMockData, rolesState } from '../../shared/utils/storage';
import { AppPwaInstallButton } from '../../shared/atoms/pwa-install-button.component';
import { activeUserContext, switchActiveRole } from '../rbac.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppPwaInstallButton],
  template: `
    <header class="h-14 sm:h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-2.5 sm:px-6 flex items-center justify-between sticky top-0 z-30 w-full overflow-hidden">
      <!-- Left: Mobile Menu & Current Page Title -->
      <div class="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 mr-2">
        <button type="button" (click)="toggleMobileNav.emit()" class="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 shrink-0" aria-label="Buka Menu Tree">
          <mat-icon class="text-xl">menu</mat-icon>
        </button>
        <div class="min-w-0">
          <span class="text-[9px] sm:text-[10px] font-bold text-indigo-600 uppercase tracking-wider block leading-none">Komunika OS</span>
          <p class="text-xs sm:text-sm font-bold text-slate-900 truncate">{{ currentTitle() }}</p>
        </div>
      </div>

      <!-- Right: Action Controls -->
      <div class="flex items-center gap-1 sm:gap-2 shrink-0">
        <div class="hidden sm:block">
          <app-pwa-install-button />
        </div>

        <button type="button" (click)="resetDemoData()" title="Muat Data Demo" class="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium">
          <mat-icon class="text-sm">refresh</mat-icon>
          <span>Demo</span>
        </button>

        <!-- Role Badge & Switcher -->
        <div class="flex items-center gap-1 bg-indigo-50/90 px-1.5 sm:px-2 py-1 rounded-xl border border-indigo-100 text-xs">
          <mat-icon class="text-sm text-indigo-600 shrink-0">badge</mat-icon>
          <select aria-label="Peran Pengguna" [value]="activeUser().roleCode" (change)="onRoleSelect($any($event.target).value)" class="bg-transparent text-[11px] sm:text-xs font-semibold text-indigo-900 border-none focus:outline-none cursor-pointer max-w-[58px] sm:max-w-[120px] truncate">
            @for (r of roles(); track r.id) {
              <option [value]="r.code">{{ r.name }}</option>
            }
          </select>
        </div>

        <!-- Language Pill (Desktop) -->
        <div class="hidden sm:flex items-center rounded-xl bg-slate-100 p-0.5 text-xs font-bold">
          <button type="button" (click)="setLang('id')" [class]="currentLang() === 'id' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'" class="px-2 py-1 rounded-lg">ID</button>
          <button type="button" (click)="setLang('en')" [class]="currentLang() === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'" class="px-2 py-1 rounded-lg">EN</button>
        </div>

        <!-- Notification Bell -->
        <button type="button" (click)="toggleNotification.emit()" aria-label="Notifikasi" class="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100">
          <mat-icon class="text-lg">notifications_none</mat-icon>
          @if (unreadCount() > 0) {
            <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          }
        </button>

        <!-- User Profile Avatar -->
        <button type="button" (click)="openProfile.emit()" aria-label="Profil Saya" class="flex items-center gap-1 sm:gap-2 pl-1 border-l border-slate-200 hover:opacity-80 text-left">
          <img [src]="activeUser().avatarUrl" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-indigo-500/20" alt="Avatar" referrerpolicy="no-referrer" />
          <div class="hidden md:block text-left text-xs">
            <p class="font-bold text-slate-900 leading-tight">{{ activeUser().name }}</p>
            <p class="text-[10px] text-slate-400 font-semibold capitalize">{{ activeUser().roleCode.replace('_', ' ') }}</p>
          </div>
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  currentTitle = input.required<string>();
  toggleMobileNav = output<void>();
  toggleNotification = output<void>();
  openProfile = output<void>();
  currentLang = currentLanguage;
  notificationsState = notificationsState;
  activeUser = activeUserContext;
  roles = rolesState;

  unreadCount(): number { return this.notificationsState().filter(n => !n.read).length; }
  setLang(l: 'id' | 'en'): void { setAppLanguage(l); }
  onRoleSelect(code: 'super_admin' | 'ketua' | 'bendahara' | 'moderator' | 'anggota'): void { switchActiveRole(code); }
  resetDemoData(): void {
    if (confirm('Muat ulang dataset komprehensif (anggota, iuran, forum, pengaturan)?')) {
      restoreMockData();
    }
  }
}
