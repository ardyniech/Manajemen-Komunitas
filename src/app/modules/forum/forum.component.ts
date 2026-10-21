import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { topicsState } from '../../shared/utils/storage';
import { TopicCardComponent } from './topic-card.component';
import { navigateTo } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-forum',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, TopicCardComponent],
  template: `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Forum Diskusi & Musyawarah Komunitas</h2>
          <p class="text-xs text-slate-500">Ruang kolaborasi terenkripsi, pertukaran ide, dan pengumuman resmi.</p>
        </div>
        <button type="button" (click)="goToNewTopic()" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800">
          <mat-icon class="text-base">add_comment</mat-icon> Tulis Topik Baru
        </button>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto pb-1">
        @for (cat of ['Semua', 'Pengumuman', 'Umum', 'Keuangan & Proyek', 'Ide & Inovasi']; track cat) {
          <button type="button" (click)="selectedCategory.set(cat)" [class]="selectedCategory() === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'" class="px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap shadow-2xs">
            {{ cat }}
          </button>
        }
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (top of filteredTopics(); track top.id) {
          <app-topic-card [topic]="top" (topicSelected)="openThread($event.id)" />
        }
      </div>
    </div>
  `
})
export class ForumComponent {
  selectedCategory = signal('Semua');

  filteredTopics = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'Semua' ? topicsState() : topicsState().filter(t => t.category === cat);
  });

  goToNewTopic(): void { navigateTo('forum-new'); }
  openThread(topicId: string): void { navigateTo('forum-thread', { topicId }); }
}

