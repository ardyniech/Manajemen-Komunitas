import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { settingsState } from '../../shared/utils/storage';

@Component({
  selector: 'app-landing-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white p-8 md:p-12 shadow-xl border border-indigo-900/50">
      <div class="relative z-10 max-w-3xl space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Komunika OS • Sistem Operasi Komunitas Modern</span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
          Kelola Komunitas Tanpa Ribet, <span class="bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent">Transparan & Terenkripsi.</span>
        </h1>

        <p class="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
          Platform terpadu untuk direktori anggota ber-KTA digital, pembukuan kas otomatis dengan QRIS statis, forum diskusi aman, dan kendali hak akses berbasis peran (RBAC).
        </p>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            (click)="startRegister.emit()"
            class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <mat-icon class="text-base">how_to_reg</mat-icon>
            <span>Daftar Anggota Baru</span>
          </button>
          <button
            type="button"
            (click)="startLogin.emit()"
            class="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs md:text-sm rounded-xl transition-all backdrop-blur-md flex items-center gap-2"
          >
            <mat-icon class="text-base">login</mat-icon>
            <span>Masuk ke Akun</span>
          </button>
          <button
            type="button"
            (click)="enterDemo.emit()"
            class="px-4 py-3 text-slate-300 hover:text-white font-medium text-xs rounded-xl flex items-center gap-1.5"
          >
            <mat-icon class="text-base text-emerald-400">play_circle_filled</mat-icon>
            <span>Masuk Mode Demo Pengurus</span>
          </button>
        </div>

        <!-- Key Metrics Ribbon -->
        <div class="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 text-center sm:text-left">
          <div>
            <span class="block text-2xl font-black text-white font-mono">100%</span>
            <span class="text-[11px] text-slate-400">Transparansi Kas</span>
          </div>
          <div>
            <span class="block text-2xl font-black text-white font-mono">AES-GCM</span>
            <span class="text-[11px] text-slate-400">Enkripsi E2EE</span>
          </div>
          <div>
            <span class="block text-2xl font-black text-white font-mono">Zero-Lag</span>
            <span class="text-[11px] text-slate-400">Local-First UI</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LandingHeroSectionComponent {
  startRegister = output<void>();
  startLogin = output<void>();
  enterDemo = output<void>();
  settings = settingsState;
}
