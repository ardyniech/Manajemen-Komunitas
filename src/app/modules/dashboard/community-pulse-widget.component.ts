import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { pulseStats, activePulseTab, lastPulseSyncTime, refreshPulseData } from './community-pulse-service';
import { CommunityPulseFeedComponent } from './community-pulse-feed.component';
import { navigateTo } from '../../core/navigation/navigation.service';
import { dispatcher } from '../../core/dispatcher';
import { ForumTopic } from '../../shared/models/forum.model';

@Component({
  selector: 'app-community-pulse-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, CommunityPulseFeedComponent],
  template: `
    <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <!-- Header with Live Pulse Indicator -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
            <mat-icon class="text-xl">sensors</mat-icon>
          </span>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">Community Pulse</h3>
              <span class="relative flex h-2.5 w-2.5" title="Sistem Aktif & Terhubung">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span class="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                Live {{ stats().pulseHealthScore }}% Activity Index
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">Statistik real-time aktivitas forum, pendaftaran anggota, dan verifikasi keuangan.</p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <span class="text-[11px] text-slate-400 font-medium hidden md:inline">Sinkronisasi: {{ lastSync() }}</span>
          <button type="button" (click)="onRefresh()" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5">
            <mat-icon class="text-xs text-indigo-600">sync</mat-icon>
            <span>Sinkronkan</span>
          </button>
        </div>
      </div>

      <!-- Real-Time Metrics KPI Row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button type="button" (click)="activeTab.set('threads')" [class]="activeTab() === 'threads' ? 'ring-2 ring-indigo-500 bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/60'" class="p-3 rounded-2xl border text-left transition-all cursor-pointer">
          <div class="flex items-center justify-between text-slate-500 text-xs">
            <span class="font-semibold">Utas Forum Aktif</span>
            <mat-icon class="text-indigo-600 text-sm">forum</mat-icon>
          </div>
          <div class="mt-1 flex items-baseline gap-2">
            <span class="text-xl font-black text-slate-900">{{ stats().activeThreadsCount }}</span>
            <span class="text-[10px] font-bold text-indigo-700">Diskusi Ramai</span>
          </div>
        </button>

        <button type="button" (click)="activeTab.set('members')" [class]="activeTab() === 'members' ? 'ring-2 ring-emerald-500 bg-emerald-50/50 border-emerald-200' : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/60'" class="p-3 rounded-2xl border text-left transition-all cursor-pointer">
          <div class="flex items-center justify-between text-slate-500 text-xs">
            <span class="font-semibold">Anggota Baru</span>
            <mat-icon class="text-emerald-600 text-sm">person_add</mat-icon>
          </div>
          <div class="mt-1 flex items-baseline gap-2">
            <span class="text-xl font-black text-slate-900">{{ stats().recentMembersCount }}</span>
            <span class="text-[10px] font-bold text-emerald-700">Terdaftar</span>
          </div>
        </button>

        <button type="button" (click)="activeTab.set('finance')" [class]="activeTab() === 'finance' ? 'ring-2 ring-amber-500 bg-amber-50/50 border-amber-200' : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/60'" class="p-3 rounded-2xl border text-left transition-all cursor-pointer">
          <div class="flex items-center justify-between text-slate-500 text-xs">
            <span class="font-semibold">Kas Menunggu</span>
            <mat-icon class="text-amber-600 text-sm">pending_actions</mat-icon>
          </div>
          <div class="mt-1 flex items-baseline gap-2">
            <span class="text-xl font-black text-slate-900">{{ stats().pendingApprovalsCount }}</span>
            <span class="text-[10px] font-bold text-amber-800">{{ stats().formattedPendingAmount }}</span>
          </div>
        </button>
      </div>

      <!-- Feed Container Component -->
      <app-community-pulse-feed
        [activeTab]="activeTab()"
        (selectTopic)="onSelectTopic($event)"
        (selectMember)="onSelectMember()"
        (openFinance)="gotoPage('finance')"
      />
    </div>
  `
})
export class CommunityPulseWidgetComponent {
  stats = pulseStats;
  activeTab = activePulseTab;
  lastSync = lastPulseSyncTime;

  onRefresh(): void {
    refreshPulseData();
  }

  onSelectTopic(topic: ForumTopic): void {
    dispatcher.emit('TOPIC_SELECTED', { topicId: topic.id }, 'community-pulse');
    navigateTo('forum-thread');
  }

  onSelectMember(): void {
    navigateTo('members');
  }

  gotoPage(page: 'forum' | 'members' | 'finance'): void {
    navigateTo(page);
  }
}
