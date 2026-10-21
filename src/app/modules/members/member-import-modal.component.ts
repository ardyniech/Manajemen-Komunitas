import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppModal } from '../../shared/atoms/modal.component';
import { parseCsvOrText, ImportPreviewResult } from '../../shared/utils/import-engine';
import { Member } from '../../shared/models/member.model';

@Component({
  selector: 'app-member-import-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppModal],
  template: `
    <app-modal [isOpen]="isOpen()" title="Universal CSV / Text Importer" subtitle="Impor data anggota dari file CSV, Excel TSV, atau teks terpisah koma/titik-koma" (dismiss)="modalClose.emit()">
      <div class="space-y-4">
        <div>
          <label for="csv-input-area" class="block text-xs font-semibold text-slate-700 mb-1">
            Format Kolom: Nama Lengkap, Email, Telepon, Tier, Status
          </label>
          <textarea
            id="csv-input-area"
            #txtArea
            (input)="onTextInput(txtArea.value)"
            rows="5"
            placeholder="Contoh:&#10;Dimas Pratama,dimas@domain.id,081234567,reguler,aktif&#10;Rani Kusuma;rani@gmail.com;08198765;vip;aktif"
            class="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          ></textarea>
        </div>

        @if (preview()) {
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div class="flex items-center justify-between font-semibold">
              <span class="text-slate-800">Pemisah Terdeteksi: {{ preview()?.detectedDelimiter }}</span>
              <span class="text-emerald-600">{{ preview()?.validRows?.length }} baris valid siap diimpor</span>
            </div>

            @if ((preview()?.errorRows?.length ?? 0) > 0) {
              <div class="text-rose-600 text-[11px]">
                Perhatian: {{ preview()?.errorRows?.length }} baris tidak valid dilewati.
              </div>
            }
          </div>
        }
      </div>

      <div footer class="flex items-center gap-2">
        <button type="button" (click)="modalClose.emit()" class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">Batal</button>
        <button
          type="button"
          [disabled]="!preview() || (preview()?.validRows?.length ?? 0) === 0"
          (click)="onConfirm()"
          class="px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Konfirmasi Impor ({{ preview()?.validRows?.length ?? 0 }})
        </button>
      </div>
    </app-modal>
  `
})
export class MemberImportModalComponent {
  isOpen = input.required<boolean>();
  modalClose = output<void>();
  importConfirmed = output<Partial<Member>[]>();

  preview = signal<ImportPreviewResult | null>(null);

  onTextInput(text: string): void {
    if (!text.trim()) {
      this.preview.set(null);
      return;
    }
    const res = parseCsvOrText(text);
    this.preview.set(res);
  }

  onConfirm(): void {
    const valid = this.preview()?.validRows;
    if (valid && valid.length > 0) {
      this.importConfirmed.emit(valid);
      this.preview.set(null);
    }
  }
}
