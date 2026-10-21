import { ChangeDetectionStrategy, Component, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { memberEthicalRecords, MemberEthicalRecord } from './dewan-etik-governance-service';

@Component({
  selector: 'app-dewan-etik-conflict-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      <div class="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <mat-icon class="text-lg">shield</mat-icon>
          </span>
          <div>
            <h4 class="text-sm font-bold text-slate-900">Pengawasan Konflik Formasi & Karakter Tim</h4>
            <p class="text-[11px] text-slate-500">Deteksi otomatis friksi elemen, polaritas shio ciong, weton padu, & benturan struktural</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-rose-700 block">{{ flagCount() }} Isu Terdeteksi</span>
          <span class="text-[10px] text-slate-400">{{ clearRatio() }}% Bebas Konflik</span>
        </div>
      </div>

      @if (flaggedRecords().length === 0) {
        <div class="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center gap-3">
          <mat-icon class="text-emerald-600 text-xl">verified_user</mat-icon>
          <div>
            <p class="text-xs font-bold text-emerald-950">Seluruh Penempatan Selaras & Bebas Konflik</p>
            <p class="text-[11px] text-emerald-700 mt-0.5">Tidak ditemukan benturan watak antar-anggota maupun pelanggaran regulasi AD/ART.</p>
          </div>
        </div>
      } @else {
        <div class="space-y-2.5">
          @for (rec of flaggedRecords(); track rec.talent.memberId) {
            <div class="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/70 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div class="min-w-0 space-y-1.5 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-bold text-xs text-slate-900">{{ rec.member?.fullName || 'Anggota' }}</span>
                  <span class="text-[10px] text-slate-500 font-mono">{{ rec.member?.memberNumber || 'N/A' }}</span>
                  <span class="text-[10px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {{ rec.talent.recommendedDivision.replace('_', ' ') }}
                  </span>
                  @if (rec.teamConflicts.length > 0) {
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      Friksi Karakter Tim
                    </span>
                  }
                </div>

                <div class="space-y-1 text-[11px] text-slate-700">
                  @for (flag of rec.conflictFlags; track flag) {
                    <div class="flex items-start gap-1.5 bg-white/70 p-1.5 rounded-lg border border-amber-200/50">
                      <mat-icon class="text-xs text-amber-600 shrink-0 mt-0.5">warning_amber</mat-icon>
                      <span class="leading-relaxed">{{ flag }}</span>
                    </div>
                  }
                </div>
              </div>

              <button
                type="button"
                (click)="reviewCandidate.emit(rec)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs shrink-0 self-start transition-colors"
              >
                <mat-icon class="text-sm text-indigo-600">gavel</mat-icon>
                <span>Telaah Majelis</span>
              </button>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class DewanEtikConflictPanelComponent {
  records = memberEthicalRecords;
  reviewCandidate = output<MemberEthicalRecord>();

  flaggedRecords = computed(() => this.records().filter(r => r.conflictFlags.length > 0));
  flagCount = computed(() => this.flaggedRecords().length);
  clearRatio = computed(() => {
    const total = this.records().length || 1;
    const clean = total - this.flagCount();
    return Math.round((clean / total) * 100);
  });
}
