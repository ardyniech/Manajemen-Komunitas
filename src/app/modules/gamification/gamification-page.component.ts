import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GamificationStatsCardComponent } from './gamification-stats-card.component';
import { PointHistoryListComponent } from './point-history-list.component';
import { ReferralCardComponent } from './referral-card.component';
import { gamificationState } from '../../core/gamification/gamification.service';

@Component({
  selector: 'app-gamification-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatIconModule, GamificationStatsCardComponent,
    PointHistoryListComponent, ReferralCardComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Top Level Stats Banner -->
      <app-gamification-stats-card [gamification]="state()" />

      <!-- Referral Invitation Banner -->
      <app-referral-card />

      <!-- XP Activity History -->
      <app-point-history-list [history]="state().history" />
    </div>
  `
})
export class GamificationPageComponent {
  state = gamificationState;
}
