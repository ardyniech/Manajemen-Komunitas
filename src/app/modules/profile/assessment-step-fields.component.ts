import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-assessment-step-fields',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form()" class="space-y-3 text-xs">
      @if (currentStep() === 1) {
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="sa-bdate" class="block font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
            <input id="sa-bdate" type="date" formControlName="birthDate" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50" />
          </div>
          <div>
            <label for="sa-bplace" class="block font-semibold text-slate-700 mb-1">Kota / Tempat Lahir *</label>
            <input id="sa-bplace" type="text" formControlName="birthPlace" placeholder="Misal: Yogyakarta" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50" />
          </div>
        </div>
      }

      @if (currentStep() === 2) {
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="sa-div" class="block font-semibold text-slate-700 mb-1">Minat Divisi *</label>
            <select id="sa-div" formControlName="preferredDivision" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
              <option value="ketua_umum">Ketua / Presidium</option>
              <option value="keuangan_bendahara">Bendahara Kas</option>
              <option value="dewan_etik">Dewan Etik</option>
              <option value="humas_komunikasi">Humas</option>
              <option value="acara_operasional">Operasional</option>
              <option value="teknologi_media">IT Media</option>
            </select>
          </div>
          <div>
            <label for="sa-hrs" class="block font-semibold text-slate-700 mb-1">Waktu (Jam/Minggu)</label>
            <input id="sa-hrs" type="number" formControlName="weeklyHoursAvailable" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50" />
          </div>
        </div>
      }

      @if (currentStep() === 3) {
        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label for="sa-style" class="block font-semibold text-slate-700 mb-1">Gaya Kerja *</label>
              <select id="sa-style" formControlName="workStyle" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
                <option value="visioner">Visioner</option>
                <option value="analitis">Analitis</option>
                <option value="eksekutor">Eksekutor</option>
                <option value="diplomat">Diplomat</option>
                <option value="pelindung_nilai">Pelindung Nilai</option>
              </select>
            </div>
            <div>
              <label for="sa-skills" class="block font-semibold text-slate-700 mb-1">Keahlian</label>
              <input id="sa-skills" type="text" formControlName="topSkills" placeholder="Akuntansi, Negosiasi" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50" />
            </div>
          </div>
          <div>
            <label for="sa-aspi" class="block font-semibold text-slate-700 mb-1">Aspirasi</label>
            <textarea id="sa-aspi" formControlName="aspirations" rows="2" placeholder="Komitmen kontribusi..." class="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"></textarea>
          </div>
        </div>
      }
    </div>
  `
})
export class AssessmentStepFieldsComponent {
  form = input.required<FormGroup>();
  currentStep = input.required<number>();
}
