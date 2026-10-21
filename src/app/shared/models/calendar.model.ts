export type EventCategory = 
  | 'gathering'
  | 'rapat'
  | 'workshop'
  | 'sosial'
  | 'olahraga'
  | 'keuangan';

export type RsvpStatus = 'going' | 'maybe' | 'not_going';

export interface EventAttendee {
  memberId: string;
  memberName: string;
  avatarUrl: string;
  status: RsvpStatus;
  rsvpAt: string;
  notes?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string;   // YYYY-MM-DD
  endTime: string;   // HH:mm
  isOnline: boolean;
  location: string;
  onlineMeetingUrl?: string;
  coverImage?: string;
  maxCapacity: number;
  organizerId: string;
  organizerName: string;
  organizerRole: string;
  createdAt: string;
  reminderMinutesBefore: number; // e.g., 30, 60, 1440 (1 day)
  attendees: EventAttendee[];
}

export interface EventFilterState {
  search: string;
  category: 'all' | EventCategory;
  viewMode: 'agenda' | 'month' | 'my-rsvps';
  timeFilter: 'all' | 'upcoming' | 'past';
}
