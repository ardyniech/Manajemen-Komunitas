import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberEthicalRecord } from './dewan-etik-governance-service';

@Component({
  selector: 'app-ethical-clearance-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-auto">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
            <mat-icon class="text-base text-amber-600">verified</mat-icon>
            <span>Surat Rekomendasi & Klirens Dewan Etik</span>
          </div>
          <button type="button" (click)="modalClose.emit()" class="text-slate-400 hover:text-slate-600">
            <mat-icon class="text-lg">close</mat-icon>
          </button>
        </div>

        <!-- Printable Document Area -->
        <div class="p-6 bg-amber-50/20 border border-slate-200 rounded-2xl text-slate-800 space-y-4 font-sans text-xs">
          <div class="text-center pb-3 border-b border-slate-200">
            <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Majelis Kehormatan & Dewan Etik Komunitas</p>
            <h3 class="text-sm font-black text-slate-900 uppercase mt-0.5">Surat Keterangan Klirens Integritas</h3>
            <p class="text-[10px] text-slate-500 font-mono mt-0.5">No: SK-ETIK/{{ currentYear }}/{{ record().member?.memberNumber || '001' }}</p>
          </div>

          <p class="leading-relaxed">
            Menyatakan bahwa anggota dengan data di bawah ini telah melalui proses verifikasi rekam jejak kepatuhan AD/ART, uji kepatutan weton neptu, dan penapisan konflik kepentingan:
          </p>

          <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
            <div class="grid grid-cols-3"><span class="text-slate-500">Nama Lengkap</span><span class="col-span-2 font-bold text-slate-900">: {{ record().member?.fullName }}</span></div>
            <div class="grid grid-cols-3"><span class="text-slate-500">Nomor KTA</span><span class="col-span-2 font-mono text-slate-800">: {{ record().member?.memberNumber }}</span></div>
            <div class="grid grid-cols-3"><span class="text-slate-500">Weton & Neptu</span><span class="col-span-2 font-semibold text-slate-800">: {{ record().talent.weton.wetonFull }} (Neptu {{ record().talent.weton.neptu }})</span></div>
            <div class="grid grid-cols-3"><span class="text-slate-500">Rekomendasi Jabatan</span><span class="col-span-2 font-bold text-indigo-700 capitalize">: {{ record().talent.recommendedDivision.replace('_', ' ') }}</span></div>
          </div>

          <div class="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-emerald-950">
            <p class="font-bold flex items-center gap-1.5"><mat-icon class="text-emerald-600 text-sm">verified</mat-icon>Status: DIREKOMENDASIKAN (CLEAR)</p>
            <p class="text-[11px] text-emerald-800 mt-1 leading-normal">
              Ybs dinyatakan layak dan memenuhi standar etika untuk memegang amanah formasi kepengurusan organisasi.
            </p>
          </div>

          <div class="pt-4 flex justify-between items-end border-t border-slate-200 text-[11px]">
            <div>
              <p class="text-slate-400">Ditetapkan di Jakarta,</p>
              <p class="font-semibold text-slate-700">{{ currentDate }}</p>
            </div>
            <div class="text-right">
              <p class="text-slate-400">Majelis Dewan Etik,</p>
              <p class="font-bold text-slate-900 mt-6">( Presidium Kehormatan )</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" (click)="modalClose.emit()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Tutup</button>
          <button type="button" (click)="printDocument()" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs flex items-center gap-1.5">
            <mat-icon class="text-sm">print</mat-icon><span>Cetak Surat Rekomendasi</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class EthicalClearanceModalComponent {
  record = input.required<MemberEthicalRecord>();
  modalClose = output<void>();

  currentYear = new Date().getFullYear();
  currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  printDocument(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
