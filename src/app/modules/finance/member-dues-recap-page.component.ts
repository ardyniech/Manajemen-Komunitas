import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { membersState } from '../../shared/utils/storage';
import { Member } from '../../shared/models/member.model';
import { MemberDuesModalComponent } from './member-dues-modal.component';
import { DuesRecapListComponent } from './dues-recap-list.component';
import { buildWhatsAppRecapText } from '../../shared/utils/whatsapp-recap-helper';
import { navigateTo } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-member-dues-recap-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MemberDuesModalComponent, DuesRecapListComponent],
  template: `
    <div class="space-y-5 max-w-5xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"><mat-icon class="text-base">arrow_back</mat-icon></button>
          <div>
            <h2 class="text-lg font-bold text-slate-900 tracking-tight">Rekapitulasi Iuran Kas Anggota Komunitas</h2>
            <p class="text-xs text-slate-500">Sinkronisasi data 57 anggota, riwayat setoran, dan generator pengumuman WhatsApp.</p>
          </div>
        </div>
        <button type="button" (click)="copyWhatsAppText()" class="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 inline-flex items-center gap-1.5">
          <mat-icon class="text-base">content_copy</mat-icon> {{ copyFeedback() || 'Salin Format WA' }}
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs"><span class="text-[11px] font-semibold text-slate-400 block">Total Anggota</span><p class="text-lg font-bold text-slate-900">{{ members().length }} Anggota</p></div>
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs"><span class="text-[11px] font-semibold text-emerald-600 block">Lunas s/d Sept+</span><p class="text-lg font-bold text-emerald-600">{{ paidCount() }} Orang</p></div>
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs"><span class="text-[11px] font-semibold text-amber-600 block">Perlu Perpanjangan</span><p class="text-lg font-bold text-amber-600">{{ dueSoonCount() }} Orang</p></div>
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs"><span class="text-[11px] font-semibold text-rose-500 block">Pending / Belum Terdata</span><p class="text-lg font-bold text-rose-500">{{ pendingCount() }} Orang</p></div>
      </div>

      <div class="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div class="w-full sm:w-72 relative">
          <mat-icon class="absolute left-3 top-2 text-slate-400 text-base">search</mat-icon>
          <input type="text" [value]="searchTerm()" (input)="searchTerm.set($any($event.target).value)" placeholder="Cari nama anggota..." class="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <div class="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          @for (f of ['all', 'lunas', 'perpanjangan', 'pending']; track f) {
            <button type="button" (click)="selectedFilter.set(f)" [class]="selectedFilter() === f ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-2.5 py-1 rounded-lg capitalize whitespace-nowrap text-[11px]">
              {{ f === 'all' ? 'Semua' : f }}
            </button>
          }
        </div>
      </div>

      <app-dues-recap-list [members]="filteredMembers()" (payClick)="selectedMemberForPay.set($event)" />

      @if (selectedMemberForPay(); as mem) {
        <app-member-dues-modal [member]="mem" (closeModal)="selectedMemberForPay.set(null)" (paymentSuccess)="selectedMemberForPay.set(null)" />
      }
    </div>
  `
})
export class MemberDuesRecapPageComponent {
  members = membersState;
  searchTerm = signal('');
  selectedFilter = signal('all');
  selectedMemberForPay = signal<Member | null>(null);
  copyFeedback = signal('');

  paidCount = computed(() => this.members().filter(m => m.duesPaidUntil >= '2026-09-01' && m.status === 'aktif').length);
  dueSoonCount = computed(() => this.members().filter(m => m.duesPaidUntil < '2026-09-01' && m.status === 'aktif').length);
  pendingCount = computed(() => this.members().filter(m => m.status === 'pending').length);

  filteredMembers = computed(() => {
    const q = this.searchTerm().toLowerCase().trim();
    const f = this.selectedFilter();
    return this.members().filter(m => {
      const matchQ = !q || m.fullName.toLowerCase().includes(q) || (m.notes || '').toLowerCase().includes(q);
      if (!matchQ) return false;
      if (f === 'lunas') return m.duesPaidUntil >= '2026-09-01' && m.status === 'aktif';
      if (f === 'perpanjangan') return m.duesPaidUntil < '2026-09-01' && m.status === 'aktif';
      if (f === 'pending') return m.status === 'pending';
      return true;
    });
  });

  goBack(): void { navigateTo('finance'); }

  copyWhatsAppText(): void {
    const txt = buildWhatsAppRecapText(this.members());
    navigator.clipboard.writeText(txt).then(() => {
      this.copyFeedback.set('Tersalin!');
      setTimeout(() => this.copyFeedback.set(''), 2500);
    });
  }
}
