import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

@Component({
  selector: 'app-pwa-install-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (isInstallable() && !isInstalled()) {
      <button
        type="button"
        id="btn-pwa-install"
        (click)="install()"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
      >
        <mat-icon class="text-sm">get_app</mat-icon>
        <span>Pasang Aplikasi</span>
      </button>
    } @else if (isIOS() && !isInstalled()) {
      <button
        type="button"
        id="btn-pwa-ios-guide"
        (click)="showIOSGuide.set(!showIOSGuide())"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
      >
        <mat-icon class="text-sm">ios_share</mat-icon>
        <span>Install PWA</span>
      </button>

      @if (showIOSGuide()) {
        <div class="absolute right-4 top-16 z-50 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 text-xs max-w-xs space-y-2 animate-in fade-in">
          <div class="flex items-center justify-between font-bold text-slate-900">
            <span>Install di iPhone/iPad</span>
            <button type="button" (click)="showIOSGuide.set(false)" class="text-slate-400 hover:text-slate-600">
              <mat-icon class="text-sm">close</mat-icon>
            </button>
          </div>
          <p class="text-slate-600">
            1. Tekan tombol <strong>Share</strong> (ikon kotak dengan panah ke atas) di Safari.<br>
            2. Gulir ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama).
          </p>
        </div>
      }
    }
  `
})
export class AppPwaInstallButton implements OnInit {
  isInstallable = signal<boolean>(false);
  isInstalled = signal<boolean>(false);
  isIOS = signal<boolean>(false);
  showIOSGuide = signal<boolean>(false);

  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const nav = window.navigator as NavigatorWithStandalone;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
    this.isInstalled.set(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    this.isIOS.set(/iphone|ipad|ipod/.test(ua));

    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.isInstallable.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.isInstallable.set(false);
      this.deferredPrompt = null;
    });
  }

  async install(): Promise<void> {
    if (!this.deferredPrompt) return;
    await this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      this.isInstalled.set(true);
      this.isInstallable.set(false);
    }
    this.deferredPrompt = null;
  }
}
