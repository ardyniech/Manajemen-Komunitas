import { ChangeDetectionStrategy, Component, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthUser } from '../../shared/models/auth.model';
import { updateAuthProfile } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile-custom-fields',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-sm font-bold text-slate-900">Atribut & Data Komunitas Khusus</h3>
          <p class="text-xs text-slate-500">Kelola informasi divisi wilayah, kontak darurat, dan keahlian</p>
        </div>
        @if (savedSuccess()) {
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
            <mat-icon class="text-sm">check_circle</mat-icon> Tersimpan
          </span>
        }
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="prof-chapter" class="block text-xs font-semibold text-slate-700 mb-1">Chapter Wilayah</label>
            <input id="prof-chapter" type="text" formControlName="chapter" placeholder="misal: Jabodetabek & Banten" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
          <div>
            <label for="prof-emergency" class="block text-xs font-semibold text-slate-700 mb-1">Kontak Darurat (Emergency)</label>
            <input id="prof-emergency" type="text" formControlName="emergencyContact" placeholder="0812xxxx (Hubungan)" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
          </div>
        </div>

        <div>
          <label for="prof-vehicle" class="block text-xs font-semibold text-slate-700 mb-1">Nomor Plat Kendaraan / ID Khusus Touring</label>
          <input id="prof-vehicle" type="text" formControlName="vehicleNumber" placeholder="B 1234 KOM" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
        </div>

        <!-- Skills & Interests Tags -->
        <div class="space-y-2">
          <label for="new-skill-input" class="block text-xs font-semibold text-slate-700">Keahlian & Minat Kontribusi</label>
          <div class="flex flex-wrap gap-1.5 items-center">
            @for (s of currentSkills(); track s) {
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                <span>{{ s }}</span>
                <button type="button" (click)="removeSkill(s)" class="text-indigo-400 hover:text-rose-500 font-bold ml-1">×</button>
              </span>
            }
          </div>
          <div class="flex gap-2 pt-1">
            <input id="new-skill-input" #newSkillInput type="text" placeholder="Tambah keahlian (misal: Fotografi, Akuntansi)..." class="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50" />
            <button type="button" (click)="addSkill(newSkillInput.value); newSkillInput.value = ''" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl">Tambah</button>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button type="submit" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5">
            <mat-icon class="text-sm">save</mat-icon>
            <span>Simpan Data Komunitas</span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProfileCustomFieldsComponent {
  user = input.required<AuthUser>();
  currentSkills = signal<string[]>([]);
  savedSuccess = signal(false);

  form = new FormGroup({
    chapter: new FormControl(''),
    emergencyContact: new FormControl(''),
    vehicleNumber: new FormControl('')
  });

  constructor() {
    effect(() => {
      const u = this.user();
      this.form.patchValue({
        chapter: u.chapter || '',
        emergencyContact: u.emergencyContact || '',
        vehicleNumber: u.vehicleNumber || ''
      });
      this.currentSkills.set(u.skills || []);
    });
  }

  addSkill(skill: string): void {
    const trimmed = skill.trim();
    if (trimmed && !this.currentSkills().includes(trimmed)) {
      this.currentSkills.update(list => [...list, trimmed]);
    }
  }

  removeSkill(skill: string): void {
    this.currentSkills.update(list => list.filter(s => s !== skill));
  }

  onSubmit(): void {
    const val = this.form.value;
    updateAuthProfile({
      chapter: val.chapter ?? '',
      emergencyContact: val.emergencyContact ?? '',
      vehicleNumber: val.vehicleNumber ?? '',
      skills: this.currentSkills()
    });
    this.savedSuccess.set(true);
    setTimeout(() => this.savedSuccess.set(false), 3000);
  }
}
