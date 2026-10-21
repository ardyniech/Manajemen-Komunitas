import { computed, signal } from '@angular/core';
import { membersState, topicsState, transactionsState, persistAll, notificationsState } from '../../shared/utils/storage';
import { ForumTopic } from '../../shared/models/forum.model';
import { Member } from '../../shared/models/member.model';
import { FinanceTransaction } from '../../shared/models/finance.model';
import { dispatcher } from '../../core/dispatcher';

export interface CommunityPulseStats {
  activeThreadsCount: number;
  recentMembersCount: number;
  pendingApprovalsCount: number;
  pendingApprovalsAmount: number;
  formattedPendingAmount: string;
  pulseHealthScore: number;
}

export const activePulseTab = signal<'threads' | 'members' | 'finance'>('threads');
export const lastPulseSyncTime = signal<string>('Baru saja');

export const pulseStats = computed<CommunityPulseStats>(() => {
  const topics = topicsState();
  const members = membersState();
  const txs = transactionsState();

  const activeThreads = topics.filter(t => t.comments.length > 0 || t.isPinned);
  const pendingTxs = txs.filter(t => t.status === 'menunggu');
  const pendingSum = pendingTxs.reduce((sum, t) => sum + t.amount, 0);

  // Health score based on active forum engagement, active member ratio, and quick finance processing
  const activeMembersRatio = members.length > 0 ? (members.filter(m => m.status === 'aktif').length / members.length) * 100 : 80;
  const healthScore = Math.min(98, Math.round(activeMembersRatio * 0.6 + Math.min(30, activeThreads.length * 3) + 10));

  return {
    activeThreadsCount: activeThreads.length,
    recentMembersCount: members.length,
    pendingApprovalsCount: pendingTxs.length,
    pendingApprovalsAmount: pendingSum,
    formattedPendingAmount: 'Rp ' + pendingSum.toLocaleString('id-ID'),
    pulseHealthScore: healthScore
  };
});

export const recentActiveThreads = computed<ForumTopic[]>(() => {
  return [...topicsState()]
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, 4);
});

export const recentNewMembers = computed<Member[]>(() => {
  return [...membersState()]
    .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
    .slice(0, 4);
});

export const pendingFinanceApprovals = computed<FinanceTransaction[]>(() => {
  return transactionsState().filter(t => t.status === 'menunggu');
});

export function approveFinanceTransactionFromPulse(txId: string): void {
  transactionsState.update(list =>
    list.map(tx => tx.id === txId ? { ...tx, status: 'lunas' as const } : tx)
  );
  persistAll();

  notificationsState.update(notes => [
    {
      id: `notif-${Date.now()}`,
      title: 'Verifikasi Kas Disetujui',
      message: `Transaksi #${txId} telah disetujui via Community Pulse Dashboard.`,
      type: 'payment',
      timestamp: 'Baru saja',
      read: false
    },
    ...notes
  ]);

  dispatcher.emit('TRANSACTION_UPDATED', { transactionId: txId }, 'community-pulse');
  lastPulseSyncTime.set(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
}

export function refreshPulseData(): void {
  lastPulseSyncTime.set(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
}
