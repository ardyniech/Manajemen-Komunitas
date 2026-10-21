import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export type AppEventType =
  | 'MEMBER_REGISTERED'
  | 'MEMBER_UPDATED'
  | 'MEMBER_DELETED'
  | 'DUES_RECORDED'
  | 'EXPENSE_RECORDED'
  | 'TRANSACTION_UPDATED'
  | 'FINANCE_TRANSACTION_CREATED'
  | 'TOPIC_CREATED'
  | 'TOPIC_SELECTED'
  | 'COMMENT_POSTED'
  | 'EVENT_CREATED'
  | 'EVENT_UPDATED'
  | 'EVENT_DELETED'
  | 'EVENT_RSVP_SUBMITTED'
  | 'POINTS_AWARDED'
  | 'BACKUP_TRIGGERED'
  | 'SECURITY_STATE_CHANGED'
  | 'NOTIFICATION_PUSHED'
  | 'DATA_RESTORED'
  | 'ROLE_UPDATED'
  | 'USER_LOGGED_IN'
  | 'USER_REGISTERED'
  | 'PROFILE_UPDATED'
  | 'USER_LOGGED_OUT';

export interface AppEvent<T = unknown> {
  type: AppEventType;
  payload: T;
  sourceModule: string;
  timestamp: string;
}

class EventDispatcher {
  private readonly bus$ = new Subject<AppEvent>();

  public emit<T>(type: AppEventType, payload: T, sourceModule = 'core'): void {
    this.bus$.next({
      type,
      payload,
      sourceModule,
      timestamp: new Date().toISOString()
    });
  }

  public on<T>(type: AppEventType): Observable<AppEvent<T>> {
    return this.bus$.asObservable().pipe(
      filter((e): e is AppEvent<T> => e.type === type)
    );
  }

  public allEvents(): Observable<AppEvent> {
    return this.bus$.asObservable();
  }
}

export const dispatcher = new EventDispatcher();
