import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { membersState, transactionsState, topicsState, backupsState } from '../../shared/utils/storage';
import { DashboardHeroComponent } from './dashboard-hero.component';
import { DashboardKpisComponent } from './dashboard-kpis.component';
import { DashboardOnboardingComponent } from './dashboard-onboarding.component';
import { MembershipTrendChartComponent } from './membership-trend-chart.component';
import { CashFlowChartComponent } from './cash-flow-chart.component';
import { RecentForumCardComponent } from './recent-forum-card.component';
import { CommunityPulseWidgetComponent } from './community-pulse-widget.component';
import { navigateTo } from '../../core/navigation/navigation.service';
import { dispatcher } from '../../core/dispatcher';
import { ForumTopic } from '../../shared/models/forum.model';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, DashboardHeroComponent, DashboardOnboardingComponent,
    DashboardKpisComponent, CommunityPulseWidgetComponent,
    MembershipTrendChartComponent, CashFlowChartComponent, RecentForumCardComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="animate-fade-in-up stagger-1">
        <app-dashboard-hero (triggerBackup)="quickBackup()" />
      </div>

      <!-- Just-In-Time Progressive Onboarding & Gamification -->
      <div class="animate-fade-in-up stagger-2">
        <app-dashboard-onboarding />
      </div>

      <div class="animate-fade-in-up stagger-3">
        <app-dashboard-kpis
          [totalMembers]="totalMembers()"
          [formattedBalance]="formattedBalance()"
          [collectionRate]="collectionRate()"
          [totalTopics]="totalTopics()"
        />
      </div>

      <!-- Real-Time Community Pulse Widget -->
      <div class="animate-fade-in-up stagger-4">
        <app-community-pulse-widget />
      </div>

      <!-- Visual Analytics & Charts Bento Grid with D3.js -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="animate-fade-in-up stagger-5 h-full">
          <app-membership-trend-chart />
        </div>
        <div class="animate-fade-in-up stagger-6 h-full">
          <app-cash-flow-chart />
        </div>
      </div>

      <!-- Recent Community Activity -->
      <div class="grid grid-cols-1 gap-6 animate-fade-in-up stagger-7">
        <app-recent-forum-card
          (openAllTopics)="gotoPage('forum')"
          (createNewTopic)="gotoPage('forum-new')"
          (selectTopic)="onSelectTopic($event)"
        />
      </div>
    </div>
  `
})
export class DashboardComponent {
  totalMembers = computed(() => membersState().length);
  totalTopics = computed(() => topicsState().length);

  totalBalance = computed(() => {
    return transactionsState().reduce((acc, tx) => (tx.type === 'pengeluaran' ? acc - tx.amount : acc + tx.amount), 0);
  });

  formattedBalance = computed(() => 'Rp ' + this.totalBalance().toLocaleString('id-ID'));

  collectionRate = computed(() => {
    const total = membersState().length;
    if (total === 0) return 0;
    const paid = membersState().filter(m => m.status === 'aktif').length;
    return Math.round((paid / total) * 100);
  });

  gotoPage(page: 'forum' | 'forum-new' | 'members' | 'finance'): void {
    navigateTo(page);
  }

  onSelectTopic(topic: ForumTopic): void {
    dispatcher.emit('TOPIC_SELECTED', { topicId: topic.id }, 'dashboard');
    navigateTo('forum-thread');
  }

  quickBackup(): void {
    const backupId = `bk-${Date.now()}`;
    backupsState.update(list => [
      {
        id: backupId,
        createdAt: new Date().toLocaleString('id-ID'),
        fileName: `komunika_snapshot_${Date.now()}.json`,
        sizeBytes: 152000,
        destination: 'Google Drive',
        status: 'synced',
        checksum: 'sha256-instant'
      },
      ...list
    ]);
    dispatcher.emit('BACKUP_TRIGGERED', { backupId }, 'dashboard');
  }
}
