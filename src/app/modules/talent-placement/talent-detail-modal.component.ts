import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MemberPersonalTalent, DivisionCategory } from '../../shared/models/personality-talent.model';
import { Member } from '../../shared/models/member.model';
import { updateDewanEtikReview } from '../../core/talent/talent.service';

@Component({
  selector: 'app-talent-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="p-1.5 bg-purple-50 text-purple-700 rounded-lg"><mat-icon class="text-lg">gavel</mat-icon></span>
            <div>
              <h3 class="font-bold text-slate-800 text-sm">Sidang Dewan Etik & Evaluasi Bakat</h3>
              <p class="text-xs text-slate-500">{{ member()?.fullName }} ({{ member()?.memberNumber }})</p>
            </div>
          </div>
          <button type="button" (click)="modalClose.emit()" class="text-slate-400 hover:text-slate-600 p-1"><mat-icon class="text-lg">close</mat-icon></button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
            <span class="font-bold text-amber-900 block flex items-center gap-1">
              <mat-icon class="text-sm">flare</mat-icon> Primbon & Weton Jawa
            </span>
            <p class="text-slate-800 font-semibold">{{ talent().weton.wetonFull }} (Neptu {{ talent().weton.neptu }})</p>
            <p class="text-[11px] text-slate-600">Watak: {{ talent().weton.watakUtama }}</p>
            <p class="text-[11px] text-slate-500">{{ talent().weton.karakterKepribadian }}</p>
          </div>

          <div class="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
            <span class="font-bold text-indigo-900 block flex items-center gap-1">
              <mat-icon class="text-sm">wb_twilight</mat-icon> Astrologi & Shio
            </span>
            <p class="text-slate-800 font-semibold">{{ talent().astrology.zodiacSign }} & Shio {{ talent().astrology.shio }} ({{ talent().astrology.shioElement }})</p>
            <p class="text-[11px] text-slate-600">Elemen: {{ talent().astrology.element }}</p>
            <p class="text-[11px] text-slate-500">{{ talent().astrology.sifatKepemimpinan }}</p>
          </div>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1">
          <span class="font-semibold text-slate-700 block">Aspirasi & Pengalaman Anggota:</span>
          <p class="text-slate-600 text-[11px] italic">"{{ talent().aspirations }}"</p>
          <p class="text-slate-500 text-[10px]">Pengalaman: {{ talent().leadershipExperience }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSave()" class="space-y-3 pt-2">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="dew-div" class="block text-xs font-semibold text-slate-700 mb-1">Penetapan Divisi *</label>
              <select id="dew-div" formControlName="division" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
                <option value="ketua_umum">Ketua / Presidium</option>
                <option value="keuangan_bendahara">Bendahara Kas</option>
                <option value="dewan_etik">Dewan Etik</option>
                <option value="humas_komunikasi">Humas & Kemitraan</option>
                <option value="acara_operasional">Operasional Acara</option>
                <option value="teknologi_media">IT & Media Kreatif</option>
                <option value="sosial_relawan">Sosial & Relawan</option>
              </select>
            </div>
            <div>
              <label for="dew-score" class="block text-xs font-semibold text-slate-700 mb-1">Skor Kecocokan (%)</label>
              <input id="dew-score" type="number" formControlName="fitScore" min="50" max="100" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white" />
            </div>
          </div>

          <div>
            <label for="dew-notes" class="block text-xs font-semibold text-slate-700 mb-1">Catatan Rahasia Dewan Etik *</label>
            <textarea id="dew-notes" formControlName="notes" rows="3" placeholder="Tuliskan pertimbangan integritas, rekam jejak, dan hasil musyawarah dewan etik..." class="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"></textarea>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" (click)="modalClose.emit()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">Tutup</button>
            <button type="submit" class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5">
              <mat-icon class="text-sm">verified</mat-icon><span>Simpan Keputusan Penempatan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TalentDetailModalComponent {
  talent = input.required<MemberPersonalTalent>();
  member = input<Member | undefined>();
  modalClose = output<void>();

  form = new FormGroup({
    division: new FormControl<DivisionCategory>('humas_komunikasi', [Validators.required]),
    fitScore: new FormControl<number>(95, [Validators.required]),
    notes: new FormControl<string>('', [Validators.required])
  });

  constructor() {
    setTimeout(() => {
      const t = this.talent();
      this.form.patchValue({ division: t.recommendedDivision, fitScore: t.fitScore, notes: t.dewanEtikNotes || '' });
    }, 0);
  }

  onSave(): void {
    const v = this.form.getRawValue();
    updateDewanEtikReview(this.talent().memberId, v.notes || '', v.division || 'humas_komunikasi', Number(v.fitScore) || 90);
    this.modalClose.emit();
  }
}
