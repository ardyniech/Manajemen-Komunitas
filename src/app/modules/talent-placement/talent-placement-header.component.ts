import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DivisionCategory } from '../../shared/models/personality-talent.model';

@Component({
  selector: 'app-talent-placement-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="p-2.5 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100">
            <mat-icon class="text-2xl">account_tree</mat-icon>
          </span>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-lg font-bold text-slate-900 tracking-tight">Penempatan Pengurus & Dewan Etik</h1>
              <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                Hak Akses Khusus
              </span>
            </div>
            <p class="text-xs text-slate-500">Evaluasi kecocokan karakter, weton, astronomi, dan minat anggota untuk formasi kepengurusan.</p>
          </div>
        </div>

        <div class="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <mat-icon class="text-amber-600 text-base shrink-0">verified_user</mat-icon>
          <span class="text-[11px] leading-tight">Data asesmen internal ini bersifat rahasia dan hanya dapat diakses oleh Admin & Dewan Etik.</span>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          <button type="button" (click)="divisionChange.emit('all')" [class]="selectedDivision() === 'all' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-3 py-1.5 rounded-xl shrink-0">Semua Divisi</button>
          <button type="button" (click)="divisionChange.emit('ketua_umum')" [class]="selectedDivision() === 'ketua_umum' ? 'bg-indigo-600 text-white font-semibold' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'" class="px-3 py-1.5 rounded-xl shrink-0">Ketua / Presidium</button>
          <button type="button" (click)="divisionChange.emit('keuangan_bendahara')" [class]="selectedDivision() === 'keuangan_bendahara' ? 'bg-emerald-600 text-white font-semibold' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'" class="px-3 py-1.5 rounded-xl shrink-0">Bendahara / Kas</button>
          <button type="button" (click)="divisionChange.emit('dewan_etik')" [class]="selectedDivision() === 'dewan_etik' ? 'bg-purple-600 text-white font-semibold' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'" class="px-3 py-1.5 rounded-xl shrink-0">Dewan Etik</button>
          <button type="button" (click)="divisionChange.emit('humas_komunikasi')" [class]="selectedDivision() === 'humas_komunikasi' ? 'bg-blue-600 text-white font-semibold' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'" class="px-3 py-1.5 rounded-xl shrink-0">Humas</button>
        </div>

        <div class="relative w-full sm:w-64">
          <mat-icon class="absolute left-3 top-2.5 text-slate-400 text-sm">search</mat-icon>
          <input
            type="text"
            placeholder="Cari kandidat / keahlian..."
            [value]="searchTerm()"
            (input)="onSearchInput($event)"
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  `
})
export class TalentPlacementHeaderComponent {
  selectedDivision = input<string>('all');
  searchTerm = input<string>('');
  divisionChange = output<'all' | DivisionCategory>();
  searchChange = output<string>();

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchChange.emit(val);
  }
}
