import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LandingHeroSectionComponent } from './landing-hero-section.component';
import { LandingFeaturesSectionComponent } from './landing-features-section.component';
import { AuthLoginCardComponent } from './auth-login-card.component';
import { AuthRegisterCardComponent } from './auth-register-card.component';
import { settingsState } from '../../shared/utils/storage';

@Component({
  selector: 'app-landing-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    LandingHeroSectionComponent,
    LandingFeaturesSectionComponent,
    AuthLoginCardComponent,
    AuthRegisterCardComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <!-- Public Nav Header -->
      <header class="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5">
        <div class="max-w-6xl mx-auto flex items-center justify-between">
          <button type="button" class="flex items-center gap-3 text-left" (click)="viewMode.set('landing')">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-xs">
              <mat-icon class="text-lg">hub</mat-icon>
            </div>
            <div>
              <h1 class="text-sm font-bold text-slate-900 tracking-tight">{{ settings().communityName }}</h1>
              <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Portal Komunitas & Autentikasi</span>
            </div>
          </button>

          <div class="flex items-center gap-2">
            @if (viewMode() === 'landing') {
              <button type="button" (click)="viewMode.set('login')" class="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl">Masuk</button>
              <button type="button" (click)="viewMode.set('register')" class="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs">Daftar Anggota</button>
            } @else {
              <button type="button" (click)="viewMode.set('landing')" class="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1">
                <mat-icon class="text-sm">arrow_back</mat-icon>
                <span>Beranda Portal</span>
              </button>
            }
          </div>
        </div>
      </header>

      <!-- Main Stage Container -->
      <main class="max-w-6xl mx-auto px-4 sm:px-6 pt-6 md:pt-8 space-y-10">
        @switch (viewMode()) {
          @case ('landing') {
            <app-landing-hero-section
              (startRegister)="viewMode.set('register')"
              (startLogin)="viewMode.set('login')"
              (enterDemo)="onAuthCompleted()"
            />
            <app-landing-features-section />
          }
          @case ('login') {
            <div class="py-6">
              <app-auth-login-card
                (loginSuccess)="onAuthCompleted()"
                (switchToRegister)="viewMode.set('register')"
              />
            </div>
          }
          @case ('register') {
            <div class="py-6">
              <app-auth-register-card
                (registerSuccess)="onAuthCompleted()"
                (switchToLogin)="viewMode.set('login')"
              />
            </div>
          }
        }
      </main>
    </div>
  `
})
export class LandingAuthComponent {
  authenticated = output<void>();
  viewMode = signal<'landing' | 'login' | 'register'>('landing');
  settings = settingsState;

  onAuthCompleted(): void {
    this.authenticated.emit();
  }
}
