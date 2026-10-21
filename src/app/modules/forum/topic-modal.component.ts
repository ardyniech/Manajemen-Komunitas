import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppModal } from '../../shared/atoms/modal.component';
import { ForumTopic } from '../../shared/models/forum.model';

@Component({
  selector: 'app-topic-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, AppModal],
  template: `
    <app-modal [isOpen]="isOpen()" title="Mulai Diskusi Baru" subtitle="Bagikan pengumuman atau ajukan ide ke komunitas" (dismiss)="modalClose.emit()">
      <form [formGroup]="form" class="space-y-4">
        <div>
          <label for="topic-category" class="block text-xs font-semibold text-slate-700 mb-1">Kategori Diskusi *</label>
          <select id="topic-category" formControlName="category" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
            <option value="Pengumuman">Pengumuman Resmi</option>
            <option value="Umum">Diskusi Umum</option>
            <option value="Keuangan & Proyek">Keuangan & Proyek</option>
            <option value="Ide & Inovasi">Ide & Inovasi</option>
          </select>
        </div>

        <div>
          <label for="topic-title" class="block text-xs font-semibold text-slate-700 mb-1">Judul Diskusi *</label>
          <input id="topic-title" formControlName="title" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="e.g. Pembahasan Rencana Meetup Oktober..." />
        </div>

        <div>
          <label for="topic-content" class="block text-xs font-semibold text-slate-700 mb-1">Isi Diskusi / Pesan *</label>
          <textarea id="topic-content" formControlName="content" rows="4" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="Tuliskan detail pemikiran atau pengumuman Anda..."></textarea>
        </div>

        <div class="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <mat-icon class="text-indigo-600 text-base">lock</mat-icon>
            <div>
              <p class="text-xs font-bold text-indigo-900">Enkripsi End-to-End (E2EE)</p>
              <p class="text-[10px] text-indigo-700">Enkripsi payload AES-GCM 256-bit di browser</p>
            </div>
          </div>
          <input type="checkbox" formControlName="isEncrypted" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
        </div>
      </form>

      <div footer class="flex items-center gap-2">
        <button type="button" (click)="modalClose.emit()" class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">Batal</button>
        <button type="button" [disabled]="form.invalid" (click)="onSubmit()" class="px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">Terbitkan Topik</button>
      </div>
    </app-modal>
  `
})
export class TopicModalComponent {
  isOpen = input.required<boolean>();
  modalClose = output<void>();
  save = output<Partial<ForumTopic>>();

  form = new FormGroup({
    category: new FormControl<'Pengumuman' | 'Umum' | 'Keuangan & Proyek' | 'Ide & Inovasi'>('Umum', [Validators.required]),
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    content: new FormControl('', [Validators.required, Validators.minLength(10)]),
    isEncrypted: new FormControl(false)
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.save.emit(this.form.value as Partial<ForumTopic>);
    this.form.reset({ category: 'Umum', isEncrypted: false });
  }
}
