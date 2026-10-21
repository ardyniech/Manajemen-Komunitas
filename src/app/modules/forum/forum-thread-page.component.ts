import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { topicsState, persistAll } from '../../shared/utils/storage';
import { navigateTo, pageParams } from '../../core/navigation/navigation.service';
import { activeUserContext, currentUserRole } from '../../core/rbac.service';
import { dispatcher } from '../../core/dispatcher';
import { decryptText } from '../../shared/utils/crypto';
import { ForumComment } from '../../shared/models/forum.model';
import { awardPoints } from '../../core/gamification/gamification.service';

@Component({
  selector: 'app-forum-thread-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="flex items-center gap-3">
        <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"><mat-icon class="text-base">arrow_back</mat-icon></button>
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Ruang Diskusi Komunitas</h2>
          <p class="text-xs text-slate-500">Komentar dan tanggapan dari seluruh anggota komunitas.</p>
        </div>
      </div>

      @if (topic(); as t) {
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700">{{ t.category }}</span>
              <h3 class="text-base font-bold text-slate-900 mt-1">{{ t.title }}</h3>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-500 font-medium">{{ t.authorName }}</span>
              <span class="text-[10px] text-slate-400 block font-mono">{{ t.createdAt.substring(0, 10) }}</span>
            </div>
          </div>

          <div class="text-xs text-slate-700 leading-relaxed whitespace-pre-line py-2">
            {{ isDecrypted() ? decryptedContent() : t.content }}
          </div>

          @if (t.isEncrypted && !isDecrypted()) {
            <button type="button" (click)="decrypt()" class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold inline-flex items-center gap-1.5">
              <mat-icon class="text-sm">lock_open</mat-icon> Dekripsi Pesan E2EE
            </button>
          }

          <div class="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <button type="button" (click)="likeTopic()" class="flex items-center gap-1 hover:text-indigo-600 font-semibold">
              <mat-icon class="text-base text-rose-500">favorite</mat-icon> {{ t.likesCount }} Suka
            </button>
            <span class="flex items-center gap-1"><mat-icon class="text-base">chat_bubble_outline</mat-icon> {{ t.comments.length }} Komentar</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Tanggapan Anggota ({{ t.comments.length }})</h4>
          <div class="space-y-3">
            @for (reply of t.comments; track reply.id) {
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-slate-900">{{ reply.authorName }}</span>
                  <span class="text-[10px] text-slate-400 font-mono">{{ reply.createdAt.substring(0, 10) }}</span>
                </div>
                <p class="text-slate-600">{{ reply.content }}</p>
              </div>
            }
          </div>

          <div class="pt-4 border-t border-slate-100 flex gap-2">
            <input #replyInput [value]="replyText()" (input)="replyText.set(replyInput.value)" type="text" placeholder="Tulis tanggapan (+10 XP)..." class="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200" />
            <button type="button" (click)="addReply()" [disabled]="!replyText().trim()" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-50">Kirim</button>
          </div>
        </div>
      }
    </div>
  `
})
export class ForumThreadPageComponent {
  currentUser = activeUserContext;
  currentRole = currentUserRole;
  replyText = signal('');
  isDecrypted = signal(false);
  decryptedContent = signal('');

  topic = computed(() => {
    const id = pageParams()['topicId'] as string;
    return topicsState().find(t => t.id === id) || topicsState()[0];
  });

  goBack(): void { navigateTo('forum'); }

  async decrypt(): Promise<void> {
    const t = this.topic();
    if (!t) return;
    this.decryptedContent.set(await decryptText(t.content, 'komunika-master-salt'));
    this.isDecrypted.set(true);
  }

  likeTopic(): void {
    const t = this.topic();
    if (!t) return;
    topicsState.update(list => list.map(item => item.id === t.id ? { ...item, likesCount: item.likesCount + 1 } : item));
    persistAll();
  }

  addReply(): void {
    const t = this.topic();
    const content = this.replyText().trim();
    if (!t || !content) return;
    const u = this.currentUser();
    const newRep: ForumComment = {
      id: `com-${Date.now()}`, topicId: t.id, authorId: u.id, authorName: u.name,
      authorRole: this.currentRole()?.name || 'Anggota', authorAvatar: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content, createdAt: new Date().toISOString(), likesCount: 0
    };
    topicsState.update(list => list.map(item => item.id === t.id ? { ...item, comments: [...item.comments, newRep] } : item));
    persistAll();
    awardPoints(u.id, 10, 'Komentar Diskusi Forum', 'forum_post');
    dispatcher.emit('COMMENT_POSTED', newRep, 'forum');
    this.replyText.set('');
  }
}
