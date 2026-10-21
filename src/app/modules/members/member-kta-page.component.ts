import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { membersState, settingsState } from '../../shared/utils/storage';
import { navigateTo } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-member-kta-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
            <mat-icon class="text-base">arrow_back</mat-icon>
          </button>
          <div>
            <h2 class="text-lg font-bold text-slate-900 tracking-tight">Studio Kartu Tanda Anggota (KTA) Digital</h2>
            <p class="text-xs text-slate-500">Penerbitan kartu identitas resmi dengan QR Code dan nomor keanggotaan unik.</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" (click)="printKta()" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 inline-flex items-center gap-1.5">
            <mat-icon class="text-base">print</mat-icon> Cetak Kartu Fisik
          </button>
        </div>
      </div>

      <!-- Member Selector -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <span class="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Anggota:</span>
        <select
          aria-label="Pilih Anggota"
          [value]="selectedMemberId()"
          (change)="selectedMemberId.set($any($event.target).value)"
          class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
        >
          @for (m of members(); track m.id) {
            <option [value]="m.id">{{ m.fullName }} ({{ m.memberNumber }}) - {{ m.tier | uppercase }}</option>
          }
        </select>
      </div>

      @if (currentMember()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Sisi Depan KTA -->
          <div class="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between h-72">
            <div class="flex justify-between items-start z-10">
              <div>
                <span class="text-[10px] tracking-widest text-indigo-400 font-bold uppercase block">{{ settings().communityName }}</span>
                <h3 class="text-base font-bold text-white tracking-tight">OFFICIAL MEMBER CARD</h3>
              </div>
              <span class="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold uppercase">{{ currentMember()!.tier }}</span>
            </div>

            <div class="flex items-center gap-4 z-10">
              <img [src]="currentMember()!.avatarUrl" class="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/40" alt="Avatar" referrerpolicy="no-referrer" />
              <div>
                <h4 class="text-sm font-bold text-white">{{ currentMember()!.fullName }}</h4>
                <p class="text-xs text-indigo-200 font-mono tracking-wider">{{ currentMember()!.memberNumber }}</p>
                <p class="text-[10px] text-slate-400 mt-1">Bergabung: {{ currentMember()!.joinedAt }}</p>
              </div>
            </div>

            <div class="flex justify-between items-end z-10 pt-2 border-t border-indigo-900/60">
              <span class="text-[9px] text-slate-400 font-mono">STATUS: {{ currentMember()!.status | uppercase }}</span>
              <span class="text-[9px] text-indigo-300 font-mono">CHIP SECURITY v2.4</span>
            </div>
          </div>

          <!-- Sisi Belakang KTA (Syarat & Ketentuan + QR) -->
          <div class="bg-slate-100 text-slate-800 p-6 rounded-3xl border border-slate-300 shadow-md flex flex-col justify-between h-72">
            <div>
              <h4 class="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">Ketentuan Penggunaan</h4>
              <ul class="text-[10px] text-slate-600 space-y-1 list-disc pl-4 leading-relaxed">
                <li>Kartu ini adalah tanda keanggotaan sah komunitas {{ settings().communityName }}.</li>
                <li>Gunakan QR Code untuk verifikasi absensi meetup & iuran.</li>
                <li>Tidak dapat dipindahtangankan ke pihak luar.</li>
              </ul>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-200">
              <div class="text-[10px]">
                <p class="font-bold text-slate-800">Verifikasi Resmi</p>
                <p class="text-slate-500 font-mono">komunika.id/kta/{{ currentMember()!.memberNumber }}</p>
              </div>
              <div class="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                <mat-icon class="text-2xl text-slate-900">qr_code_2</mat-icon>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MemberKtaPageComponent {
  members = membersState;
  settings = settingsState;
  selectedMemberId = signal<string>(membersState()[0]?.id || '');

  currentMember = computed(() => {
    return this.members().find(m => m.id === this.selectedMemberId()) || this.members()[0];
  });

  goBack(): void { navigateTo('members'); }
  printKta(): void { window.print(); }
}
