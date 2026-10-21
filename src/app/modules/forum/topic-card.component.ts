import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ForumTopic } from '../../shared/models/forum.model';
import { AppBadge } from '../../shared/atoms/badge.component';

@Component({
  selector: 'app-topic-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppBadge],
  template: `
    <div
      role="button"
      tabindex="0"
      (keydown.enter)="topicSelected.emit(topic())"
      (click)="topicSelected.emit(topic())"
      class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
    >
      <div>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          @if (topic().isPinned) {
            <app-badge variant="danger">PINNED</app-badge>
          }
          <app-badge variant="info">{{ topic().category }}</app-badge>
          @if (topic().isEncrypted) {
            <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              <mat-icon class="text-xs">lock</mat-icon> E2EE
            </span>
          }
          <span class="text-xs text-slate-400 font-medium ml-auto">
            {{ topic().createdAt.split('T')[0] }}
          </span>
        </div>

        <h3 class="text-sm font-bold text-slate-900 line-clamp-2 mb-1.5 hover:text-indigo-600 transition-colors">
          {{ topic().title }}
        </h3>
        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {{ topic().content }}
        </p>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div class="flex items-center gap-2">
          <img [src]="topic().authorAvatar" class="w-6 h-6 rounded-full object-cover" alt="Avatar" referrerpolicy="no-referrer" />
          <span class="font-medium text-slate-700">{{ topic().authorName }}</span>
        </div>
        <div class="flex items-center gap-3 text-slate-400 font-medium text-[11px]">
          <span class="inline-flex items-center gap-1">
            <mat-icon class="text-sm">visibility</mat-icon> {{ topic().viewsCount }}
          </span>
          <span class="inline-flex items-center gap-1 text-indigo-600">
            <mat-icon class="text-sm">chat_bubble_outline</mat-icon> {{ topic().comments.length }}
          </span>
          <span class="inline-flex items-center gap-1 text-rose-500">
            <mat-icon class="text-sm">favorite_border</mat-icon> {{ topic().likesCount }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class TopicCardComponent {
  topic = input.required<ForumTopic>();
  topicSelected = output<ForumTopic>();
}
