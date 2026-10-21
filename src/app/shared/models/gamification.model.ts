export type PointActionType = 
  | 'forum_post' 
  | 'dues_paid' 
  | 'referral' 
  | 'event_rsvp' 
  | 'profile_complete' 
  | 'admin_adjustment';

export interface PointActivity {
  id: string;
  memberId: string;
  actionType: PointActionType;
  points: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface MemberGamification {
  memberId: string;
  totalPoints: number;
  currentLevel: number;
  levelName: string;
  rankTitle: string;
  history: PointActivity[];
  forumPostsCount: number;
  duesPaidCount: number;
  referralsCount: number;
  eventsAttendedCount: number;
}

export interface LeaderboardRank {
  rank: number;
  memberId: string;
  memberName: string;
  memberNumber: string;
  avatarUrl: string;
  tier: string;
  totalPoints: number;
  levelName: string;
}
