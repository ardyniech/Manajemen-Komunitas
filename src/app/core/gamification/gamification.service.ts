import { signal, computed } from '@angular/core';
import { MemberGamification, PointActionType, PointActivity, LeaderboardRank } from '../../shared/models/gamification.model';
import { INITIAL_GAMIFICATION_USER } from '../initial-gamification';
import { calculateLevel } from './level-system';
import { dispatcher } from '../dispatcher';
import { membersState } from '../../shared/utils/storage';

const GAMIFICATION_KEY = 'komunika_gamification_state';

function loadGamification(): MemberGamification {
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    return raw ? JSON.parse(raw) : INITIAL_GAMIFICATION_USER;
  } catch {
    return INITIAL_GAMIFICATION_USER;
  }
}

function saveGamification(state: MemberGamification): void {
  try {
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save gamification state', err);
  }
}

export const gamificationState = signal<MemberGamification>(loadGamification());

export const leaderboardRanks = computed<LeaderboardRank[]>(() => {
  const members = membersState();
  const currentGami = gamificationState();

  const list: LeaderboardRank[] = members.slice(0, 10).map((m, idx) => {
    const isCurrent = m.id === currentGami.memberId || m.id === 'mem-1';
    const pts = isCurrent ? currentGami.totalPoints : Math.max(50, 600 - idx * 45 + (m.fullName.charCodeAt(0) % 30));
    const lvl = calculateLevel(pts);
    return { rank: 0, memberId: m.id, memberName: m.fullName, memberNumber: m.memberNumber, avatarUrl: m.avatarUrl, tier: m.tier, totalPoints: pts, levelName: lvl.name };
  });

  return list.sort((a, b) => b.totalPoints - a.totalPoints).map((item, index) => ({ ...item, rank: index + 1 }));
});

export function awardPoints(memberId: string, points: number, title: string, actionType: PointActionType): void {
  const current = gamificationState();
  const newTotal = current.totalPoints + points;
  const levelInfo = calculateLevel(newTotal);

  const newActivity: PointActivity = {
    id: `act-${Date.now()}`,
    memberId,
    actionType,
    points,
    title,
    description: `Mendapatkan +${points} XP (${title})`,
    createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'
  };

  const updatedForum = current.forumPostsCount + (actionType === 'forum_post' ? 1 : 0);
  const updatedDues = current.duesPaidCount + (actionType === 'dues_paid' ? 1 : 0);
  const updatedRef = current.referralsCount + (actionType === 'referral' ? 1 : 0);
  const updatedEvents = current.eventsAttendedCount + (actionType === 'event_rsvp' ? 1 : 0);

  const updatedState: MemberGamification = {
    ...current,
    totalPoints: newTotal,
    currentLevel: levelInfo.level,
    levelName: levelInfo.name,
    rankTitle: levelInfo.rankTitle,
    history: [newActivity, ...current.history],
    forumPostsCount: updatedForum,
    duesPaidCount: updatedDues,
    referralsCount: updatedRef,
    eventsAttendedCount: updatedEvents
  };

  gamificationState.set(updatedState);
  saveGamification(updatedState);
  dispatcher.emit('POINTS_AWARDED', { points, title, total: newTotal }, 'gamification');
}

export function simulateReferral(friendName: string): void {
  awardPoints('mem-1', 100, `Undang Rekan (${friendName})`, 'referral');
}
