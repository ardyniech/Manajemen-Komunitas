import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { currentUser } from '../../core/auth/auth.service';
import { ProfileHeaderComponent } from './profile-header.component';
import { ProfileInfoFormComponent } from './profile-info-form.component';
import { ProfileCustomFieldsComponent } from './profile-custom-fields.component';
import { ProfileSecurityPanelComponent } from './profile-security-panel.component';
import { ProfilePassportCardComponent } from './profile-passport-card.component';
import { ProfileActivityTabComponent } from './profile-activity-tab.component';
import { MemberSelfAssessmentFormComponent } from './member-self-assessment-form.component';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    ProfileHeaderComponent,
    ProfileInfoFormComponent,
    ProfileCustomFieldsComponent,
    ProfileSecurityPanelComponent,
    ProfilePassportCardComponent,
    ProfileActivityTabComponent,
    MemberSelfAssessmentFormComponent
  ],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <app-profile-header [user]="user()" (activeTabChange)="activeSubTab.set($event)" />

      <div class="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto">
        <button type="button" (click)="activeSubTab.set('biodata')" [class]="activeSubTab() === 'biodata' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 font-medium'" class="px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0">
          <mat-icon class="text-sm text-indigo-600">person</mat-icon><span>Informasi Pribadi</span>
        </button>
        <button type="button" (click)="activeSubTab.set('talent')" [class]="activeSubTab() === 'talent' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 font-medium'" class="px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0">
          <mat-icon class="text-sm text-purple-600">psychology</mat-icon><span>Self-Assessment & Weton</span>
        </button>
        <button type="button" (click)="activeSubTab.set('activity')" [class]="activeSubTab() === 'activity' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 font-medium'" class="px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0">
          <mat-icon class="text-sm text-amber-500">insights</mat-icon><span>Aktivitas & XP</span>
        </button>
        <button type="button" (click)="activeSubTab.set('custom-data')" [class]="activeSubTab() === 'custom-data' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 font-medium'" class="px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0">
          <mat-icon class="text-sm text-emerald-600">tune</mat-icon><span>Data Tambahan</span>
        </button>
        <button type="button" (click)="activeSubTab.set('kta')" [class]="activeSubTab() === 'kta' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 font-medium'" class="px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0">
          <mat-icon class="text-sm text-amber-500">credit_card</mat-icon><span>KTA Digital</span>
        </button>
        <button type="button" (click)="activeSubTab.set('security')" [class]="activeSubTab() === 'security' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 font-medium'" class="px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0">
          <mat-icon class="text-sm text-sky-600">security</mat-icon><span>Keamanan</span>
        </button>
      </div>

      @switch (activeSubTab()) {
        @case ('biodata') { <app-profile-info-form [user]="user()" /> }
        @case ('talent') { <app-member-self-assessment-form [user]="user()" /> }
        @case ('activity') { <app-profile-activity-tab /> }
        @case ('custom-data') { <app-profile-custom-fields [user]="user()" /> }
        @case ('kta') { <app-profile-passport-card [user]="user()" /> }
        @case ('security') { <app-profile-security-panel [user]="user()" /> }
      }
    </div>
  `
})
export class ProfileComponent {
  user = currentUser;
  activeSubTab = signal<string>('biodata');
}
