import { ChangeDetectionStrategy, Component, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { topicsState } from '../../shared/utils/storage';
import { ForumTopic } from '../../shared/models/forum.model';
import { AppInfoTooltip } from '../../shared/atoms/info-tooltip.component';

@Component({
  selector: 'app-recent-forum-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppInfoTooltip],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      <div class="flex items-center justify-between mb-4">
        <div>
          <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Diskusi Komunitas</span>
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <mat-icon class="text-base text-indigo-600">forum</mat-icon>
            <span>Recent Forum Activity</span>
            <app-info-tooltip
              title="Aktivitas Forum"
              text="Daftar 4 topik musyawarah atau diskusi warga yang paling baru diperbarui atau dibuat."
              position="bottom"
            />
          </h3>
        </div>
        <button
          type="button"
          (click)="openAllTopics.emit()"
          class="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-0.5 hover:underline"
        >
          <span>Lihat Semua</span>
          <mat-icon class="text-sm">arrow_forward</mat-icon>
        </button>
      </div>

      <div class="flex-1 divide-y divide-slate-100">
        @for (topic of recentTopics(); track topic.id) {
          <div
            (click)="selectTopic.emit(topic)"
            (keydown.enter)="selectTopic.emit(topic)"
            tabindex="0"
            role="button"
            class="py-3 first:pt-0 last:pb-0 hover:bg-slate-50/80 rounded-xl px-2 -mx-2 transition-colors cursor-pointer group flex items-start justify-between gap-3"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                  {{ topic.category }}
                </span>
                @if (topic.isPinned) {
                  <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-0.5">
                    <mat-icon class="text-[12px]">push_pin</mat-icon> Pinned
                  </span>
                }
              </div>
              <h4 class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                {{ topic.title }}
              </h4>
              <p class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>Oleh <b class="text-slate-600">{{ topic.authorName }}</b></span>
                <span>•</span>
                <span>{{ topic.createdAt }}</span>
              </p>
            </div>

            <div class="flex items-center gap-2.5 text-slate-400 text-xs shrink-0 self-center">
              <span class="flex items-center gap-0.5 text-[11px] font-medium text-slate-600">
                <mat-icon class="text-sm text-slate-400">chat_bubble_outline</mat-icon>
                {{ topic.comments.length }}
              </span>
              <span class="flex items-center gap-0.5 text-[11px] font-medium text-slate-400">
                <mat-icon class="text-sm text-slate-400">visibility</mat-icon>
                {{ topic.viewsCount }}
              </span>
            </div>
          </div>
        } @empty {
          <div class="py-8 text-center text-slate-400 text-xs">
            <mat-icon class="text-2xl text-slate-300 mx-auto block mb-1">chat</mat-icon>
            Belum ada aktivitas forum terkini.
          </div>
        }
      </div>

      <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total {{ totalTopicsCount() }} topik aktif dibahas</span>
        <button type="button" (click)="createNewTopic.emit()" class="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
          <mat-icon class="text-sm">add_circle</mat-icon> Buat Topik
        </button>
      </div>
    </div>
  `
})
export class RecentForumCardComponent {
  openAllTopics = output<void>();
  selectTopic = output<ForumTopic>();
  createNewTopic = output<void>();

  recentTopics = computed(() => topicsState().slice(0, 4));
  totalTopicsCount = computed(() => topicsState().length);
}
