import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { memberEthicalRecords, DIVISION_OPTIONS, divisionCountsMap } from './dewan-etik-governance-service';
import { calculateSmartMatch, batchApplyAllSmartMatches } from './smart-matching-engine';
import { DivisionCategory } from '../../shared/models/personality-talent.model';

@Component({
  selector: 'app-dewan-etik-smart-matching-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-amber-50/40 rounded-2xl border border-purple-200/70 p-5 shadow-xs space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start sm:items-center gap-3.5">
          <span class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <mat-icon class="text-xl">auto_fix_high</mat-icon>
          </span>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="text-sm font-bold text-slate-900">Smart Matching Formasi Triad</h4>
              <span class="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">Weton · Zodiak · Shio</span>
            </div>
            <p class="text-xs text-slate-600 mt-0.5">Mesin komputasi otomatis memetakan bakat, neptu kepemimpinan, dan elemen karakter ke formasi struktural.</p>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <div class="text-right hidden sm:block">
            <span class="text-xs font-black text-purple-900 block">{{ highMatchCount() }} Kandidat Ideal</span>
            <span class="text-[10px] text-slate-500">Kecocokan Triad &ge; 90%</span>
          </div>
          <button type="button" (click)="runBatchMatch()" [disabled]="isProcessing()" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white text-xs font-bold shadow-xs transition-colors">
            <mat-icon class="text-sm">sync</mat-icon>
            <span>{{ isProcessing() ? 'Memproses...' : 'Sinkronkan Auto-Match' }}</span>
          </button>
        </div>
      </div>

      <!-- Interactive Division Filter Bar -->
      <div class="pt-3 border-t border-purple-200/60">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-xs font-bold text-slate-800 flex items-center gap-1">
            <mat-icon class="text-sm text-purple-600">filter_list</mat-icon>
            <span>Saring Rekomendasi Departemen / Divisi:</span>
          </span>
          @if (selectedDivision() !== 'all') {
            <button type="button" (click)="divisionChange.emit('all')" class="text-[11px] font-semibold text-purple-700 hover:underline flex items-center gap-0.5">
              <mat-icon class="text-xs">close</mat-icon><span>Reset Filter</span>
            </button>
          }
        </div>
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none overscroll-contain">
          <button type="button" (click)="divisionChange.emit('all')" [class]="selectedDivision() === 'all' ? 'bg-purple-700 text-white font-bold shadow-2xs' : 'bg-white/90 hover:bg-white text-slate-600 border border-purple-100'" class="px-2.5 py-1.5 rounded-xl shrink-0 transition-all">
            Semua Divisi ({{ counts()['all'] || 0 }})
          </button>
          @for (opt of divisionOptions; track opt.id) {
            <button type="button" (click)="divisionChange.emit(opt.id)" [class]="selectedDivision() === opt.id ? 'bg-purple-700 text-white font-bold shadow-2xs' : 'bg-white/90 hover:bg-white text-slate-600 border border-purple-100'" class="px-2.5 py-1.5 rounded-xl shrink-0 transition-all flex items-center gap-1">
              <span>{{ opt.label }}</span>
              <span class="text-[10px] opacity-75 font-semibold">({{ counts()[opt.id] || 0 }})</span>
            </button>
          }
        </div>
      </div>

      @if (successMessage()) {
        <div class="p-2.5 rounded-xl bg-emerald-100/90 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <mat-icon class="text-sm text-emerald-700">check_circle</mat-icon>
          <span>{{ successMessage() }}</span>
        </div>
      }
    </div>
  `
})
export class DewanEtikSmartMatchingCardComponent {
  selectedDivision = input<'all' | DivisionCategory>('all');
  divisionChange = output<'all' | DivisionCategory>();

  records = memberEthicalRecords;
  counts = divisionCountsMap;
  divisionOptions = DIVISION_OPTIONS;
  isProcessing = signal<boolean>(false);
  successMessage = signal<string>('');

  calculatedMatches = computed(() => this.records().map(r => calculateSmartMatch(r.talent)));
  highMatchCount = computed(() => this.calculatedMatches().filter(m => m.topScore >= 90).length);

  runBatchMatch(): void {
    this.isProcessing.set(true);
    setTimeout(() => {
      const count = batchApplyAllSmartMatches();
      this.isProcessing.set(false);
      this.successMessage.set(`${count} formasi anggota berhasil diselaraskan dengan Smart Matching Weton, Astrologi, dan Shio.`);
      setTimeout(() => this.successMessage.set(''), 4000);
    }, 400);
  }
}
