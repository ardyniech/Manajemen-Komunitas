import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-features-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="text-center max-w-xl mx-auto space-y-2">
        <span class="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Fitur Komprehensif
        </span>
        <h2 class="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Arsitektur Khusus Komunitas Mandiri
        </h2>
        <p class="text-xs text-slate-500">
          Dirancang dengan prinsip Zero Cognitive Overload — ringkas di awal, bertenaga seiring pertumbuhan data.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <mat-icon>badge</mat-icon>
          </div>
          <h3 class="text-sm font-bold text-slate-900">KTA & Paspor Digital</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Kartu Tanda Anggota dinamis lengkap dengan QR Code verifikasi, status iuran kas, dan sinkronisasi profil real-time.
          </p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <mat-icon>account_balance_wallet</mat-icon>
          </div>
          <h3 class="text-sm font-bold text-slate-900">Kas & Iuran Otomatis</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Pembukuan pemasukan dan pengeluaran transparan, simulasi QRIS instan, serta ekspor PDF kuitansi dan neraca keuangan.
          </p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <mat-icon>lock</mat-icon>
          </div>
          <h3 class="text-sm font-bold text-slate-900">Keamanan E2EE & RBAC</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Enkripsi AES-256 GCM client-side untuk saluran rahasia dan matriks izin peran bertingkat dari Super Admin hingga Anggota.
          </p>
        </div>
      </div>
    </div>
  `
})
export class LandingFeaturesSectionComponent {}
