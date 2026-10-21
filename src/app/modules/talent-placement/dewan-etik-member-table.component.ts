import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { memberEthicalRecords, MemberEthicalRecord, EthicalStatus, formatDivision } from './dewan-etik-governance-service';
import { DivisionCategory } from '../../shared/models/personality-talent.model';

@Component({
  selector: 'app-dewan-etik-member-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h4 class="text-sm font-bold text-slate-900">Direktori Rekomendasi & Klirens Dewan Etik</h4>
          <p class="text-[11px] text-slate-500">Kelola pertimbangan etik, penetapan bidang, dan integritas anggota</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          @if (divisionFilter() !== 'all') {
            <span class="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-1 rounded-xl flex items-center gap-1 shadow-2xs">
              <span>Divisi: {{ formatDiv(divisionFilter()) }}</span>
              <button type="button" (click)="divisionChange.emit('all')" title="Reset filter divisi" class="hover:text-purple-900 flex items-center"><mat-icon class="text-xs">close</mat-icon></button>
            </span>
          }
          <div class="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button type="button" (click)="filterStatus.set('all')" [class]="filterStatus() === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'" class="px-2.5 py-1.5 rounded-lg transition-all">Semua ({{ records().length }})</button>
            <button type="button" (click)="filterStatus.set('clear')" [class]="filterStatus() === 'clear' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-500'" class="px-2.5 py-1.5 rounded-lg transition-all">Clear</button>
            <button type="button" (click)="filterStatus.set('perlu_klarifikasi')" [class]="filterStatus() === 'perlu_klarifikasi' ? 'bg-white text-amber-800 shadow-2xs font-bold' : 'text-slate-500'" class="px-2.5 py-1.5 rounded-lg transition-all">Klarifikasi</button>
          </div>
          <div class="relative">
            <mat-icon class="absolute left-2.5 top-2 text-sm text-slate-400">search</mat-icon>
            <input type="search" placeholder="Cari nama / weton..." [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" class="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none w-44" />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th class="py-3 px-4">Kandidat</th><th class="py-3 px-3">Weton & Elemen</th><th class="py-3 px-3">Rekomendasi Posisi</th><th class="py-3 px-3">Status Klirens</th><th class="py-3 px-3">Catatan Majelis</th><th class="py-3 px-4 text-right">Aksi Dewan Etik</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            @for (rec of filteredRecords(); track rec.talent.memberId) {
              <tr class="hover:bg-slate-50/60 transition-colors">
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2.5">
                    <img [src]="rec.member?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'" alt="Avatar" referrerpolicy="no-referrer" class="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                    <div class="min-w-0"><p class="font-bold text-slate-900 truncate">{{ rec.member?.fullName || 'Anggota' }}</p><p class="text-[10px] text-slate-400">{{ rec.member?.memberNumber || 'N/A' }} · {{ rec.member?.tier || 'anggota' }}</p></div>
                  </div>
                </td>
                <td class="py-3 px-3"><p class="font-semibold text-slate-900">{{ rec.talent.weton.wetonFull }}</p><p class="text-[10px] text-slate-500">Neptu {{ rec.talent.weton.neptu }} · {{ rec.talent.astrology.zodiacSign }} ({{ rec.talent.astrology.element }})</p></td>
                <td class="py-3 px-3"><p class="font-bold text-indigo-700 capitalize">{{ formatDiv(rec.talent.recommendedDivision) }}</p><p class="text-[10px] text-emerald-600 font-semibold">Fit: {{ rec.talent.fitScore }}%</p></td>
                <td class="py-3 px-3">
                  <div class="flex items-center gap-1.5 font-medium">
                    <span class="w-2 h-2 rounded-full" [class.bg-emerald-500]="rec.ethicalStatus === 'clear'" [class.bg-amber-500]="rec.ethicalStatus === 'perlu_klarifikasi'" [class.bg-indigo-500]="rec.ethicalStatus === 'mitigasi_harmoni'"></span>
                    <span class="text-xs" [class.text-emerald-700]="rec.ethicalStatus === 'clear'" [class.text-amber-800]="rec.ethicalStatus === 'perlu_klarifikasi'" [class.text-indigo-700]="rec.ethicalStatus === 'mitigasi_harmoni'">{{ rec.statusLabel }}</span>
                  </div>
                </td>
                <td class="py-3 px-3 max-w-xs"><p class="text-[11px] text-slate-600 line-clamp-2 italic">{{ rec.talent.dewanEtikNotes || 'Belum ada telaah' }}</p></td>
                <td class="py-3 px-4 text-right">
                  <div class="inline-flex items-center gap-1">
                    <button type="button" (click)="openSmartMatch.emit(rec)" title="Analisis Smart Match" class="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] inline-flex items-center gap-0.5 transition-colors"><mat-icon class="text-sm">auto_awesome</mat-icon><span>Smart</span></button>
                    <button type="button" (click)="openReview.emit(rec)" title="Telaah Putusan" class="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] inline-flex items-center gap-0.5 transition-colors"><mat-icon class="text-sm">edit_note</mat-icon><span>Telaah</span></button>
                    <button type="button" (click)="openClearance.emit(rec)" title="Surat SK" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] inline-flex items-center gap-0.5 transition-colors"><mat-icon class="text-sm text-amber-600">verified</mat-icon><span>SK</span></button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="py-8 text-center text-slate-400 text-xs">Tidak ada data anggota pada kriteria ini.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DewanEtikMemberTableComponent {
  records = memberEthicalRecords;
  divisionFilter = input<'all' | DivisionCategory>('all');
  divisionChange = output<'all' | DivisionCategory>();
  openReview = output<MemberEthicalRecord>();
  openClearance = output<MemberEthicalRecord>();
  openSmartMatch = output<MemberEthicalRecord>();
  formatDiv = formatDivision;

  filterStatus = signal<'all' | EthicalStatus>('all');
  searchQuery = signal<string>('');

  filteredRecords = computed(() => {
    const list = this.records();
    const st = this.filterStatus();
    const div = this.divisionFilter();
    const q = this.searchQuery().toLowerCase().trim();

    return list.filter(r => {
      const matchSt = st === 'all' || r.ethicalStatus === st;
      const matchDiv = div === 'all' || r.talent.recommendedDivision === div;
      const matchQ = !q || (r.member?.fullName || '').toLowerCase().includes(q) ||
        (r.member?.memberNumber || '').toLowerCase().includes(q) ||
        r.talent.weton.wetonFull.toLowerCase().includes(q);
      return matchSt && matchDiv && matchQ;
    });
  });
}
