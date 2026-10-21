import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-member-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Manajemen Anggota Komunitas</h2>
          <p class="text-xs text-slate-500">Kelola direktori anggota terdaftar, status keaktifan, dan tier peran.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" (click)="openWaRecap.emit()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100">
            <mat-icon class="text-base">chat</mat-icon> Rekap Kas WA
          </button>
          <button type="button" (click)="openImport.emit()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50">
            <mat-icon class="text-base">upload_file</mat-icon> Impor CSV
          </button>
          <button type="button" (click)="exportPDF.emit()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50">
            <mat-icon class="text-base">picture_as_pdf</mat-icon> PDF
          </button>
          <button type="button" (click)="exportExcel.emit()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50">
            <mat-icon class="text-base">table_view</mat-icon> Excel
          </button>
          <button type="button" (click)="openAdd.emit()" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800">
            <mat-icon class="text-base">person_add</mat-icon> Tambah Anggota
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div class="w-full sm:w-72 relative">
          <mat-icon class="absolute left-3 top-2.5 text-slate-400 text-base">search</mat-icon>
          <input
            id="member-search-input"
            aria-label="Cari nama, email, nomor anggota"
            type="text"
            [value]="searchTerm()"
            (input)="searchChange.emit($any($event.target).value)"
            placeholder="Cari nama, email, no. anggota..."
            class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          @for (s of ['all', 'aktif', 'pending', 'nonaktif']; track s) {
            <button
              type="button"
              (click)="statusChange.emit(s)"
              [class]="selectedStatus() === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              class="px-3 py-1 text-xs font-medium rounded-lg capitalize whitespace-nowrap"
            >
              {{ s === 'all' ? 'Semua Status' : s }}
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class MemberToolbarComponent {
  searchTerm = input.required<string>();
  selectedStatus = input.required<string>();
  searchChange = output<string>();
  statusChange = output<string>();
  openWaRecap = output<void>();
  openImport = output<void>();
  openAdd = output<void>();
  exportPDF = output<void>();
  exportExcel = output<void>();
}
