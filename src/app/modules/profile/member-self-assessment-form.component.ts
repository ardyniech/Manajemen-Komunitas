import { ChangeDetectionStrategy, Component, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthUser } from '../../shared/models/auth.model';
import { MemberPersonalTalent, DivisionCategory, WorkStyle } from '../../shared/models/personality-talent.model';
import { talentProfilesState, saveMemberTalentProfile } from '../../core/talent/talent.service';
import { awardPoints } from '../../core/gamification/gamification.service';
import { AssessmentSuccessBannerComponent } from './assessment-success-banner.component';
import { AssessmentStepNavComponent } from './assessment-step-nav.component';
import { AssessmentStepFieldsComponent } from './assessment-step-fields.component';

@Component({
  selector: 'app-member-self-assessment-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, AssessmentSuccessBannerComponent, AssessmentStepNavComponent, AssessmentStepFieldsComponent],
  template: `
    <div class="space-y-4">
      @if (calculatedProfile(); as prof) { <app-assessment-success-banner [talent]="prof" (recalculate)="calculatedProfile.set(null)" /> }

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <mat-icon class="text-indigo-600 text-lg">psychology</mat-icon><span>Formulir Self-Assessment Kepribadian</span>
            </h3>
            <p class="text-xs text-slate-500">Memicu perhitungan Weton Jawa, Astrologi, dan Shio di Backend Express.</p>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">Langkah {{ currentStep() }}/3</span>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3">
          <app-assessment-step-fields [form]="form" [currentStep]="currentStep()" />
          <app-assessment-step-nav [currentStep]="currentStep()" [isSubmitting]="isSubmitting()" [isInvalid]="form.invalid" (prev)="prevStep()" (next)="nextStep()" (submitForm)="onSubmit()" />
        </form>
      </div>
    </div>
  `
})
export class MemberSelfAssessmentFormComponent {
  user = input.required<AuthUser>();
  currentStep = signal<number>(1);
  isSubmitting = signal<boolean>(false);
  calculatedProfile = signal<MemberPersonalTalent | null>(null);

  form = new FormGroup({
    birthDate: new FormControl('1992-05-15', [Validators.required]),
    birthPlace: new FormControl('Yogyakarta', [Validators.required]),
    preferredDivision: new FormControl<DivisionCategory>('humas_komunikasi', [Validators.required]),
    workStyle: new FormControl<WorkStyle>('visioner', [Validators.required]),
    topSkills: new FormControl('Kepemimpinan, Komunikasi'),
    weeklyHoursAvailable: new FormControl(12),
    aspirations: new FormControl('Memajukan tata kelola komunitas yang harmonis.')
  });

  constructor() {
    effect(() => {
      const ex = talentProfilesState().find(t => t.memberId === this.user().id);
      if (ex) {
        this.form.patchValue({ birthDate: ex.birthDate, birthPlace: ex.birthPlace, preferredDivision: ex.preferredDivisions[0] || 'humas_komunikasi', workStyle: ex.workStyle, topSkills: ex.topSkills.join(', '), weeklyHoursAvailable: ex.weeklyHoursAvailable, aspirations: ex.aspirations });
        this.calculatedProfile.set(ex);
      }
    });
  }

  nextStep(): void { if (this.currentStep() < 3) this.currentStep.update(s => s + 1); }
  prevStep(): void { if (this.currentStep() > 1) this.currentStep.update(s => s - 1); }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    const v = this.form.getRawValue();
    const skills = (v.topSkills || '').split(',').map(s => s.trim()).filter(Boolean);
    try {
      const resp = await fetch('/api/talent/assessment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: this.user().id, birthDate: v.birthDate, birthPlace: v.birthPlace, preferredDivisions: [v.preferredDivision || 'humas_komunikasi'], workStyle: v.workStyle, topSkills: skills, weeklyHoursAvailable: v.weeklyHoursAvailable, aspirations: v.aspirations })
      });
      if (resp.ok) {
        const json = await resp.json();
        const saved = saveMemberTalentProfile(this.user().id, json.data as MemberPersonalTalent);
        awardPoints(this.user().id, 50, 'Self-Assessment Backend Selesai', 'profile_complete');
        this.calculatedProfile.set(saved);
      }
    } catch {
      const saved = saveMemberTalentProfile(this.user().id, { birthDate: v.birthDate || '1990-01-01', birthPlace: v.birthPlace || '', preferredDivisions: [v.preferredDivision || 'humas_komunikasi'], workStyle: v.workStyle || 'visioner', topSkills: skills, weeklyHoursAvailable: Number(v.weeklyHoursAvailable) || 10, aspirations: v.aspirations || '' });
      this.calculatedProfile.set(saved);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
