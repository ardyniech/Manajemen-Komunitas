import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { topicsState, persistAll } from '../../shared/utils/storage';
import { ForumTopic } from '../../shared/models/forum.model';
import { navigateTo } from '../../core/navigation/navigation.service';
import { dispatcher } from '../../core/dispatcher';
import { activeUserContext, currentUserRole } from '../../core/rbac.service';
import { encryptText } from '../../shared/utils/crypto';
import { awardPoints } from '../../core/gamification/gamification.service';

@Component({
  selector: 'app-forum-new-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-3xl mx-auto">
      <div class="flex items-center gap-3">
        <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"><mat-icon class="text-base">arrow_back</mat-icon></button>
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Mulai Topik Diskusi (+15 XP)</h2>
          <p class="text-xs text-slate-500">Berbagi gagasan, pengumuman resmi, atau musyawarah anggota.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <label for="frm-title" class="block text-xs font-semibold text-slate-700 mb-1">Judul Diskusi *</label>
          <input id="frm-title" formControlName="title" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="e.g. Usulan Jadwal Kerja Bakti & Kas" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="frm-cat" class="block text-xs font-semibold text-slate-700 mb-1">Kategori Saluran</label>
            <select id="frm-cat" formControlName="category" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
              <option value="Pengumuman">Pengumuman Resmi</option>
              <option value="Umum">Diskusi Umum</option>
              <option value="Keuangan & Proyek">Keuangan & Proyek</option>
              <option value="Ide & Inovasi">Ide & Inovasi</option>
            </select>
          </div>
          <div>
            <label for="frm-tags" class="block text-xs font-semibold text-slate-700 mb-1">Label / Tagar</label>
            <input id="frm-tags" formControlName="tags" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="agenda, munas, 2026" />
          </div>
        </div>

        <div>
          <label for="frm-content" class="block text-xs font-semibold text-slate-700 mb-1">Uraian Pembahasan *</label>
          <textarea id="frm-content" formControlName="content" rows="4" class="w-full p-3 text-xs rounded-xl border border-slate-200" placeholder="Tuliskan gagasan atau musyawarah Anda secara jelas..."></textarea>
        </div>

        <div class="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-2">
            <mat-icon class="text-indigo-600 text-lg">enhanced_encryption</mat-icon>
            <div>
              <span class="text-xs font-bold text-indigo-900 block">Enkripsi E2EE WebCrypto (AES-GCM 256)</span>
              <span class="text-[10px] text-indigo-700">Pesan dienkripsi langsung di browser sebelum disimpan.</span>
            </div>
          </div>
          <input type="checkbox" formControlName="encrypt" class="w-4 h-4 text-indigo-600 rounded" />
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" (click)="goBack()" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">Batal</button>
          <button type="submit" [disabled]="form.invalid || isSubmitting()" class="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">
            {{ isSubmitting() ? 'Mengenkripsi...' : 'Terbitkan Topik' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ForumNewPageComponent {
  currentUser = activeUserContext;
  currentRole = currentUserRole;
  isSubmitting = signal(false);

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    category: new FormControl<'Pengumuman' | 'Umum' | 'Keuangan & Proyek' | 'Ide & Inovasi'>('Umum', Validators.required),
    tags: new FormControl('diskusi, anggota'),
    content: new FormControl('', [Validators.required, Validators.minLength(10)]),
    encrypt: new FormControl(false)
  });

  goBack(): void { navigateTo('forum'); }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    const val = this.form.value;
    const finalContent = val.encrypt ? await encryptText(val.content ?? '', 'komunika-master-salt') : (val.content ?? '');
    const tagList = (val.tags ?? '').split(',').map(t => t.trim()).filter(Boolean);
    const u = this.currentUser();
    const newTopic: ForumTopic = {
      id: `top-${Date.now()}`, title: val.title ?? '', content: finalContent,
      authorId: u.id, authorName: u.name, authorRole: this.currentRole()?.name || 'Anggota',
      authorAvatar: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      category: val.category ?? 'Umum', tags: tagList, isPinned: false, viewsCount: 1, likesCount: 0,
      isEncrypted: Boolean(val.encrypt), createdAt: new Date().toISOString(), comments: []
    };

    topicsState.update(list => [newTopic, ...list]);
    persistAll();
    awardPoints(u.id, 15, 'Publikasi Topik Diskusi Forum', 'forum_post');
    dispatcher.emit('TOPIC_CREATED', newTopic, 'forum');
    this.isSubmitting.set(false);
    navigateTo('forum');
  }
}
