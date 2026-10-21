import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppModal } from '../../shared/atoms/modal.component';
import { ForumTopic } from '../../shared/models/forum.model';

@Component({
  selector: 'app-topic-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppModal],
  template: `
    @if (topic()) {
      <app-modal [isOpen]="isOpen()" [title]="topic()!.title" [subtitle]="topic()!.category" (dismiss)="modalClose.emit()">
        <div class="space-y-4">
          @if (topic()!.isEncrypted) {
            <div class="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs">
              <mat-icon class="text-sm">verified_user</mat-icon>
              <span>Terenkripsi End-to-End dengan WebCrypto AES-GCM 256-bit. Hanya anggota terotorisasi yang dapat membaca.</span>
            </div>
          }

          <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <img [src]="topic()!.authorAvatar" class="w-10 h-10 rounded-full object-cover" alt="Avatar" referrerpolicy="no-referrer" />
            <div>
              <p class="font-semibold text-slate-900 text-xs">{{ topic()!.authorName }}</p>
              <p class="text-[11px] text-slate-400">{{ topic()!.authorRole }} • {{ topic()!.createdAt.split('T')[0] }}</p>
            </div>
          </div>

          <div class="text-xs leading-relaxed text-slate-700 whitespace-pre-line p-2">
            {{ topic()!.content }}
          </div>

          <div class="flex items-center gap-4 py-2 border-y border-slate-100 text-xs">
            <button
              type="button"
              (click)="likeTopic.emit(topic()!.id)"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-600 font-medium hover:bg-rose-100"
            >
              <mat-icon class="text-sm">favorite</mat-icon> {{ topic()!.likesCount }} Suka
            </button>
            <span class="text-slate-400 text-xs">{{ topic()!.comments.length }} Komentar</span>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-semibold text-slate-800">Tanggapan Anggota:</h4>
            @for (c of topic()!.comments; track c.id) {
              <div class="p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold text-slate-900">{{ c.authorName }}</span>
                  <span class="text-[10px] text-slate-400">{{ c.authorRole }}</span>
                </div>
                <p class="text-slate-600">{{ c.content }}</p>
              </div>
            } @empty {
              <p class="text-xs text-slate-400 italic">Belum ada tanggapan. Jadilah yang pertama berkomentar!</p>
            }
          </div>

          <div class="pt-2">
            <div class="flex gap-2">
              <input
                #replyInput
                aria-label="Tulis tanggapan Anda"
                type="text"
                placeholder="Tulis tanggapan Anda..."
                class="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                (keydown.enter)="sendReply(replyInput.value); replyInput.value = ''"
              />
              <button
                type="button"
                (click)="sendReply(replyInput.value); replyInput.value = ''"
                class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      </app-modal>
    }
  `
})
export class TopicDetailModalComponent {
  isOpen = input.required<boolean>();
  topic = input<ForumTopic | null>(null);
  modalClose = output<void>();
  likeTopic = output<string>();
  addComment = output<{ topicId: string; content: string }>();

  sendReply(val: string): void {
    if (!val.trim() || !this.topic()) return;
    this.addComment.emit({ topicId: this.topic()!.id, content: val.trim() });
  }
}
