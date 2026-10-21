import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberPersonalTalent } from '../../shared/models/personality-talent.model';
import { Member } from '../../shared/models/member.model';

@Component({
  selector: 'app-board-decree-export-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="p-1.5 bg-purple-50 text-purple-700 rounded-lg"><mat-icon class="text-lg">description</mat-icon></span>
            <h3 class="font-bold text-slate-800 text-sm">Surat Keputusan (SK) Penetapan Pengurus</h3>
          </div>
          <button type="button" (click)="modalClose.emit()" class="text-slate-400 hover:text-slate-600 p-1"><mat-icon class="text-lg">close</mat-icon></button>
        </div>

        <!-- Printable Document Canvas -->
        <div id="decree-doc" class="p-6 border-2 border-slate-200 rounded-2xl bg-slate-50/40 space-y-4 text-xs font-serif text-slate-900">
          <div class="text-center border-b-2 border-slate-800 pb-3">
            <h2 class="text-sm font-bold uppercase tracking-wide">MAJELIS DEWAN ETIK & KEPENGURUSAN KOMUNIKA</h2>
            <p class="text-[10px] font-sans text-slate-500">Sekretariat Jenderal • Sistem Administrasi Komunitas Terpadu</p>
            <p class="text-[11px] font-sans font-bold mt-1">SURAT KEPUTUSAN NOMOR: 04/SK-ETIK/KOMUNIKA/X/2026</p>
          </div>

          <p class="text-[11px] leading-relaxed">
            Menimbang hasil uji kelayakan karakter, pertimbangan neptu weton kepemimpinan, dan musyawarah mufakat, Majelis Dewan Etik dengan ini menetapkan susunan pengurus periode 2026–2028:
          </p>

          <table class="w-full text-[11px] font-sans border-collapse border border-slate-300">
            <thead>
              <tr class="bg-slate-200/80 text-left">
                <th class="p-2 border border-slate-300">Jabatan / Divisi</th>
                <th class="p-2 border border-slate-300">Nama Anggota</th>
                <th class="p-2 border border-slate-300">Weton & Watak</th>
                <th class="p-2 border border-slate-300 text-center">Fit Score</th>
              </tr>
            </thead>
            <tbody>
              @for (tal of talents(); track tal.memberId) {
                <tr class="border-b border-slate-200">
                  <td class="p-2 border border-slate-300 font-bold capitalize">{{ formatDivision(tal.recommendedDivision) }}</td>
                  <td class="p-2 border border-slate-300">{{ getMemberName(tal.memberId) }}</td>
                  <td class="p-2 border border-slate-300 text-[10px] text-slate-600">{{ tal.weton.wetonFull }} ({{ tal.weton.watakUtama }})</td>
                  <td class="p-2 border border-slate-300 text-center font-bold text-emerald-700">{{ tal.fitScore }}%</td>
                </tr>
              }
            </tbody>
          </table>

          <div class="pt-4 flex items-center justify-between font-sans text-[10px] text-slate-500">
            <div>
              <p>Ditetapkan di: Yogyakarta</p>
              <p>Tanggal: 29 September 2026</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-800">Ketua Majelis Dewan Etik</p>
              <div class="my-1 text-indigo-600 font-mono text-[9px]">[TERVERIFIKASI DIGITAL E-SEAL]</div>
              <p class="font-bold text-slate-900">Dr. Arya Pratama, M.Sc.</p>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" (click)="modalClose.emit()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">Batal</button>
          <button type="button" (click)="printDocument()" class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5">
            <mat-icon class="text-sm">print</mat-icon><span>Cetak / Simpan Dokumen SK</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class BoardDecreeExportModalComponent {
  talents = input.required<MemberPersonalTalent[]>();
  members = input.required<Member[]>();
  modalClose = output<void>();

  getMemberName(id: string): string {
    return this.members().find(m => m.id === id)?.fullName || id;
  }

  formatDivision(div: string): string {
    return div.replace('_', ' ');
  }

  printDocument(): void {
    window.print();
  }
}
