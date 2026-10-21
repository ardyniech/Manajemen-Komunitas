import { ChangeDetectionStrategy, Component, input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthUser } from '../../shared/models/auth.model';
import { WorkStyle } from '../../shared/models/personality-talent.model';
import { talentProfilesState, saveMemberTalentProfile } from '../../core/talent/talent.service';
import { calculateJavaneseWeton } from '../../shared/utils/javanese-weton-calculator';
import { calculateAstrologyAndShio } from '../../shared/utils/astrology-shio-calculator';

@Component({
  selector: 'app-profile-talent-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div class="border-b border-slate-100 pb-2">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
          <mat-icon class="text-indigo-600 text-lg">psychology</mat-icon><span>Data Personal, Karakter & Minat Kepengurusan</span>
        </h3>
        <p class="text-xs text-slate-500">Data tanggal lahir & karakter digunakan Dewan Etik & Admin untuk evaluasi penempatan pengurus.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="tal-bdate" class="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
            <input id="tal-bdate" type="date" formControlName="birthDate" (change)="onDateChange()" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white" />
          </div>
          <div>
            <label for="tal-bplace" class="block text-xs font-semibold text-slate-700 mb-1">Kota / Tempat Lahir</label>
            <input id="tal-bplace" type="text" formControlName="birthPlace" placeholder="Misal: Yogyakarta" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white" />
          </div>
        </div>

        @if (liveWeton(); as w) {
          <div class="p-3 bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/60 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">J</span>
              <div><span class="font-bold text-slate-900 block">Weton: {{ w.wetonFull }} (Neptu {{ w.neptu }})</span><span class="text-[10px] text-amber-800">{{ w.watakUtama }} • {{ w.kelebihan }}</span></div>
            </div>
            @if (liveAstro(); as a) {
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">{{ a.simbol }}</span>
                <div><span class="font-bold text-slate-900 block">Zodiak {{ a.zodiacSign }} & Shio {{ a.shio }}</span><span class="text-[10px] text-indigo-700">Karakter: {{ a.element }}</span></div>
              </div>
            }
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="tal-style" class="block text-xs font-semibold text-slate-700 mb-1">Gaya Kerja Dominan *</label>
            <select id="tal-style" formControlName="workStyle" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50">
              <option value="visioner">Visioner (Perencana & Konseptor)</option>
              <option value="analitis">Analitis (Detail & Akurat)</option>
              <option value="eksekutor">Eksekutor (Cepat Lapangan)</option>
              <option value="diplomat">Diplomat (Komunikatif)</option>
              <option value="pelindung_nilai">Pelindung Nilai (Integritas & Etika)</option>
            </select>
          </div>
          <div>
            <label for="tal-hours" class="block text-xs font-semibold text-slate-700 mb-1">Alokasi Waktu (Jam/Minggu)</label>
            <input id="tal-hours" type="number" formControlName="weeklyHoursAvailable" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50" />
          </div>
        </div>

        <div>
          <label for="tal-skills" class="block text-xs font-semibold text-slate-700 mb-1">Keahlian Utama</label>
          <input id="tal-skills" type="text" formControlName="topSkills" placeholder="Akuntansi, Negosiasi, Desain Grafis" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50" />
        </div>

        <div>
          <label for="tal-aspi" class="block text-xs font-semibold text-slate-700 mb-1">Aspirasi Kontribusi</label>
          <textarea id="tal-aspi" formControlName="aspirations" rows="2" placeholder="Komitmen kontribusi Anda..." class="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50"></textarea>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-emerald-600 font-semibold">{{ saveMsg() }}</span>
          <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"><mat-icon class="text-sm">save</mat-icon><span>Simpan Data Karakter (+30 XP)</span></button>
        </div>
      </form>
    </div>
  `
})
export class ProfileTalentFormComponent {
  user = input.required<AuthUser>();
  saveMsg = signal('');
  liveDate = signal('1990-01-01');
  liveWeton = computed(() => calculateJavaneseWeton(this.liveDate()));
  liveAstro = computed(() => calculateAstrologyAndShio(this.liveDate()));

  form = new FormGroup({
    birthDate: new FormControl('1990-01-01', [Validators.required]),
    birthPlace: new FormControl(''),
    workStyle: new FormControl<WorkStyle>('visioner', [Validators.required]),
    topSkills: new FormControl('Kepemimpinan, Komunikasi'),
    weeklyHoursAvailable: new FormControl(10),
    aspirations: new FormControl('')
  });

  constructor() {
    effect(() => {
      const ex = talentProfilesState().find(t => t.memberId === this.user().id);
      if (ex) {
        this.form.patchValue({ birthDate: ex.birthDate, birthPlace: ex.birthPlace, workStyle: ex.workStyle, topSkills: ex.topSkills.join(', '), weeklyHoursAvailable: ex.weeklyHoursAvailable, aspirations: ex.aspirations });
        this.liveDate.set(ex.birthDate);
      }
    });
  }

  onDateChange(): void { if (this.form.value.birthDate) this.liveDate.set(this.form.value.birthDate); }

  onSubmit(): void {
    const v = this.form.getRawValue();
    saveMemberTalentProfile(this.user().id, {
      birthDate: v.birthDate || '1990-01-01', birthPlace: v.birthPlace || '', workStyle: v.workStyle || 'visioner',
      topSkills: (v.topSkills || '').split(',').map(s => s.trim()).filter(Boolean), weeklyHoursAvailable: Number(v.weeklyHoursAvailable) || 10, aspirations: v.aspirations || ''
    });
    this.saveMsg.set('✓ Data karakter & minat berhasil diperbarui!');
    setTimeout(() => this.saveMsg.set(''), 3000);
  }
}
