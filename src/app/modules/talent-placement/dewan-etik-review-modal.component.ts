import { ChangeDetectionStrategy, Component, OnInit, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberEthicalRecord, saveDewanEtikVerdict, formatDivision } from './dewan-etik-governance-service';
import { DivisionCategory } from '../../shared/models/personality-talent.model';
import { logPlacementChange } from './dewan-etik-log-service';
import { detectTeamConflictsForDivision } from './team-conflict-detector';
import { TeamConflictWarningComponent } from './team-conflict-warning.component';
import { talentProfilesState } from '../../core/talent/talent.service';
import { membersState } from '../../shared/utils/storage';

@Component({
  selector: 'app-dewan-etik-review-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, TeamConflictWarningComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-3 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <mat-icon class="text-base">gavel</mat-icon>
            </span>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Telaah Integritas Dewan Etik</h3>
              <p class="text-[11px] text-slate-500">{{ record().member?.fullName }} ({{ record().member?.memberNumber }})</p>
            </div>
          </div>
          <button type="button" (click)="modalClose.emit()" class="text-slate-400 hover:text-slate-600 p-1"><mat-icon class="text-lg">close</mat-icon></button>
        </div>

        <div class="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
          <div class="flex justify-between"><span class="text-slate-500">Weton & Shio:</span><span class="font-bold text-slate-800">{{ record().talent.weton.wetonFull }} · {{ record().talent.astrology.shio }} ({{ record().talent.astrology.element }})</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Gaya Kerja:</span><span class="font-bold text-indigo-700 capitalize">{{ record().talent.workStyle }}</span></div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="review-div">Rekomendasi Penempatan Formasi</label>
          <select id="review-div" [value]="selectedDiv()" (change)="selectedDiv.set($any($event.target).value)" class="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:border-indigo-500">
            <option value="ketua_umum">Ketua Umum / Presidium</option>
            <option value="keuangan_bendahara">Bendahara & Pengelolaan Kas</option>
            <option value="dewan_etik">Majelis Dewan Etik</option>
            <option value="humas_komunikasi">Humas & Hubungan Antar Lembaga</option>
            <option value="acara_operasional">Operasional Acara & Kegiatan</option>
            <option value="teknologi_media">Teknologi Informasi & Media</option>
          </select>
        </div>

        <!-- Live Team Character Conflict Warning Detection -->
        <app-team-conflict-warning [conflicts]="teamConflicts()" />

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="review-notes">Catatan & Pertimbangan Majelis Dewan Etik</label>
          <textarea id="review-notes" rows="2" [value]="notes()" (input)="notes.set($any($event.target).value)" placeholder="Tuliskan pertimbangan mitigasi friksi karakter atau regulasi AD/ART..." class="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"></textarea>
        </div>

        @if (savedNotice()) {
          <p class="text-xs text-emerald-700 font-bold flex items-center gap-1"><mat-icon class="text-sm">check_circle</mat-icon><span>Putusan & mitigasi konflik berhasil disimpan.</span></p>
        }

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button type="button" (click)="modalClose.emit()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Batal</button>
          <button type="button" (click)="submitVerdict()" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1.5">
            <mat-icon class="text-sm">save</mat-icon><span>Simpan Putusan</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DewanEtikReviewModalComponent implements OnInit {
  record = input.required<MemberEthicalRecord>();
  modalClose = output<void>();
  selectedDiv = signal<DivisionCategory>('humas_komunikasi');
  notes = signal<string>('');
  savedNotice = signal<boolean>(false);

  teamConflicts = computed(() => detectTeamConflictsForDivision(this.record().talent, this.selectedDiv(), talentProfilesState(), membersState()));

  ngOnInit(): void {
    this.selectedDiv.set(this.record().talent.recommendedDivision);
    this.notes.set(this.record().talent.dewanEtikNotes || '');
  }

  submitVerdict(): void {
    const rec = this.record();
    const prevDiv = rec.talent.recommendedDivision;
    const newDiv = this.selectedDiv();
    saveDewanEtikVerdict(rec.talent.memberId, this.notes(), newDiv);

    const conflictNotes = this.teamConflicts().length > 0 ? ` [Mitigasi: ${this.teamConflicts().map(c => c.title).join('; ')}]` : '';
    logPlacementChange({
      actorName: 'Majelis Dewan Etik',
      actorRole: 'Auditor Etik & AD/ART',
      targetMemberId: rec.talent.memberId,
      targetMemberName: rec.member?.fullName || 'Anggota',
      targetMemberNumber: rec.member?.memberNumber || '-',
      type: 'manual_override',
      typeLabel: prevDiv !== newDiv ? 'Perubahan Formasi' : 'Catatan Mitigasi Etik',
      previousPlacement: formatDivision(prevDiv),
      newPlacement: formatDivision(newDiv),
      notes: (this.notes() || 'Putusan musyawarah disahkan.') + conflictNotes
    });

    this.savedNotice.set(true);
    setTimeout(() => { this.savedNotice.set(false); this.modalClose.emit(); }, 800);
  }
}
