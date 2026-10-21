import { CommunityEvent } from '../models/calendar.model';

function formatToIcsDate(dateStr: string, timeStr: string): string {
  const cleanDate = dateStr.replace(/-/g, '');
  const cleanTime = timeStr.replace(/:/g, '') + '00';
  return `${cleanDate}T${cleanTime}`;
}

export function generateGoogleCalendarUrl(event: CommunityEvent): string {
  const start = formatToIcsDate(event.startDate, event.startTime);
  const end = formatToIcsDate(event.endDate, event.endTime);
  const loc = event.isOnline ? (event.onlineMeetingUrl || 'Online via Google Meet') : event.location;
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: `${event.description}\n\nKategori: ${event.category.toUpperCase()}\nPenyelenggara: ${event.organizerName}`,
    location: loc
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookCalendarUrl(event: CommunityEvent): string {
  const start = `${event.startDate}T${event.startTime}:00`;
  const end = `${event.endDate}T${event.endTime}:00`;
  const loc = event.isOnline ? (event.onlineMeetingUrl || 'Online Meeting') : event.location;

  const params = new URLSearchParams({
    rru: 'addevent',
    subject: event.title,
    startdt: start,
    enddt: end,
    body: `${event.description}\n\nKategori: ${event.category}\nPenyelenggara: ${event.organizerName}`,
    location: loc
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function downloadIcsFile(event: CommunityEvent): void {
  const start = formatToIcsDate(event.startDate, event.startTime);
  const end = formatToIcsDate(event.endDate, event.endTime);
  const loc = event.isOnline ? (event.onlineMeetingUrl || 'Online Event') : event.location;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Komunika OS//Community Calendar//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:komunika-event-${event.id}@komunika.id`,
    `DTSTAMP:${formatToIcsDate(new Date().toISOString().split('T')[0], '00:00')}Z`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${loc}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'event'}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function downloadAllEventsIcs(events: CommunityEvent[]): void {
  const vEvents = events.map(event => {
    const start = formatToIcsDate(event.startDate, event.startTime);
    const end = formatToIcsDate(event.endDate, event.endTime);
    const loc = event.isOnline ? (event.onlineMeetingUrl || 'Online Event') : event.location;
    return [
      'BEGIN:VEVENT',
      `UID:komunika-event-${event.id}@komunika.id`,
      `DTSTAMP:${formatToIcsDate(new Date().toISOString().split('T')[0], '00:00')}Z`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${loc}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    ].join('\r\n');
  });

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Komunika OS//Full Community Calendar//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...vEvents,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `komunika_community_calendar_all_${new Date().toISOString().slice(0, 10)}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function requestPushNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function showEventReminderPush(title: string, message: string): void {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=128&auto=format&fit=crop&q=80'
    });
  }
}
