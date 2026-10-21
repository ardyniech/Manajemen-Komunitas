import { signal, computed } from '@angular/core';
import { CommunityEvent, EventFilterState, RsvpStatus, EventAttendee } from '../../shared/models/calendar.model';
import { INITIAL_EVENTS } from '../initial-events';
import { currentUser } from '../auth/auth.service';
import { dispatcher } from '../dispatcher';
import { awardPoints } from '../gamification/gamification.service';
import { showEventReminderPush } from '../../shared/utils/calendar-export';

const STORAGE_KEY = 'komunika_events_data';

function loadEvents(): CommunityEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_EVENTS;
  } catch {
    return INITIAL_EVENTS;
  }
}

function saveEvents(list: CommunityEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save events', err);
  }
}

export const eventsState = signal<CommunityEvent[]>(loadEvents());
export const eventFilter = signal<EventFilterState>({ search: '', category: 'all', viewMode: 'agenda', timeFilter: 'all' });

export const filteredEvents = computed(() => {
  const list = eventsState();
  const filter = eventFilter();
  const user = currentUser();
  const today = new Date().toISOString().split('T')[0];

  return list.filter(evt => {
    const matchSearch = !filter.search || 
      evt.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      evt.description.toLowerCase().includes(filter.search.toLowerCase()) ||
      evt.location.toLowerCase().includes(filter.search.toLowerCase());
    const matchCategory = filter.category === 'all' || evt.category === filter.category;
    const matchTime = filter.timeFilter === 'all' || 
      (filter.timeFilter === 'upcoming' && evt.startDate >= today) ||
      (filter.timeFilter === 'past' && evt.startDate < today);
    const matchMyRsvp = filter.viewMode !== 'my-rsvps' || evt.attendees.some(a => a.memberId === user.id);
    return matchSearch && matchCategory && matchTime && matchMyRsvp;
  }).sort((a, b) => a.startDate.localeCompare(b.startDate));
});

export function addCommunityEvent(data: Omit<CommunityEvent, 'id' | 'createdAt' | 'attendees'>): CommunityEvent {
  const user = currentUser();
  const newEvent: CommunityEvent = {
    ...data,
    id: `evt-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    attendees: [{ memberId: user.id, memberName: user.fullName, avatarUrl: user.avatarUrl, status: 'going', rsvpAt: new Date().toISOString() }]
  };
  eventsState.update(prev => [newEvent, ...prev]);
  saveEvents(eventsState());
  dispatcher.emit('EVENT_CREATED', newEvent, 'calendar');
  return newEvent;
}

export function updateCommunityEvent(id: string, changes: Partial<CommunityEvent>): void {
  eventsState.update(prev => prev.map(evt => evt.id === id ? { ...evt, ...changes } : evt));
  saveEvents(eventsState());
  dispatcher.emit('EVENT_UPDATED', { id, ...changes }, 'calendar');
}

export function deleteCommunityEvent(id: string): void {
  eventsState.update(prev => prev.filter(evt => evt.id !== id));
  saveEvents(eventsState());
  dispatcher.emit('EVENT_DELETED', { id }, 'calendar');
}

export function submitEventRsvp(eventId: string, status: RsvpStatus, notes?: string): void {
  const user = currentUser();
  eventsState.update(prev => prev.map(evt => {
    if (evt.id !== eventId) return evt;
    const existingIndex = evt.attendees.findIndex(a => a.memberId === user.id);
    const newAttendee: EventAttendee = { memberId: user.id, memberName: user.fullName, avatarUrl: user.avatarUrl, status, rsvpAt: new Date().toISOString(), notes };
    const attendees = existingIndex >= 0 ? evt.attendees.map((a, i) => i === existingIndex ? newAttendee : a) : [...evt.attendees, newAttendee];
    return { ...evt, attendees };
  }));

  saveEvents(eventsState());
  if (status === 'going' || status === 'maybe') {
    awardPoints(user.id, 25, 'RSVP Kegiatan Komunitas', 'event_rsvp');
  }
  dispatcher.emit('EVENT_RSVP_SUBMITTED', { eventId, status }, 'calendar');
}

export function triggerEventReminder(event: CommunityEvent): void {
  showEventReminderPush(`Pengingat: ${event.title}`, `Akan dimulai pada ${event.startDate} pukul ${event.startTime} WIB di ${event.location}.`);
}
