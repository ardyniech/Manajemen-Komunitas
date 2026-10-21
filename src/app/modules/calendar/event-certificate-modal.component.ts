import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommunityEvent } from '../../shared/models/calendar.model';
import { currentUser } from '../../core/auth/auth.service';

@Component({
  selector: 'app-event-certificate-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><mat-icon class="text-lg">card_membership</mat-icon></span>
            <h3 class="font-bold text-slate-800 text-sm">Sertifikat Partisipasi Digital</h3>
          </div>
          <button type="button" (click)="modalClose.emit()" class="text-slate-400 hover:text-slate-600 p-1"><mat-icon class="text-lg">close</mat-icon></button>
        </div>

        <!-- Printable Certificate Canvas -->
        <div class="p-8 border-4 border-amber-300 rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-amber-50/40 text-center space-y-4 text-slate-900 shadow-inner">
          <div class="flex justify-center items-center gap-2 text-amber-600">
            <mat-icon class="text-3xl">workspace_premium</mat-icon>
            <span class="font-bold uppercase tracking-widest text-xs">KOMUNIKA COMMUNITY NETWORK</span>
          </div>

          <h2 class="text-xl font-black tracking-tight text-slate-900 font-serif">SERTIFIKAT PENGHARGAAN</h2>
          <p class="text-[11px] text-slate-500">Nomor Sertifikat: CERT/KOM/{{ event().id }}/2026</p>

          <div class="py-2">
            <p class="text-xs text-slate-500">Diberikan dengan hormat kepada:</p>
            <h3 class="text-lg font-bold text-indigo-950 underline decoration-amber-400 decoration-2 underline-offset-4 mt-1">
              {{ user().fullName }}
            </h3>
            <p class="text-[10px] text-slate-500 font-mono mt-0.5">Nomor Anggota: {{ user().memberNumber }}</p>
          </div>

          <p class="text-xs leading-relaxed text-slate-700 max-w-md mx-auto">
            Atas partisipasi aktif dan dedikasi penuh dalam kegiatan <strong>"{{ event().title }}"</strong> yang diselenggarakan pada tanggal {{ event().startDate }} berlokasi di {{ event().location }}.
          </p>

          <div class="pt-4 border-t border-amber-200 flex items-center justify-between text-[10px] text-slate-500 text-left">
            <div>
              <p class="font-bold text-slate-800">Penyelenggara Kegiatan</p>
              <p>{{ event().organizerName }} ({{ event().organizerRole }})</p>
            </div>
            <div class="text-right">
              <span class="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[9px]">
                TERVALIDASI RESMI
              </span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" (click)="modalClose.emit()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">Tutup</button>
          <button type="button" (click)="printCert()" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5">
            <mat-icon class="text-sm">print</mat-icon><span>Cetak Sertifikat (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class EventCertificateModalComponent {
  event = input.required<CommunityEvent>();
  modalClose = output<void>();
  user = currentUser;

  printCert(): void {
    window.print();
  }
}
