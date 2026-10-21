import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CloudBackupRecord } from '../../shared/models/common.model';

@Component({
  selector: 'app-backup-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Pencadangan Data Otomatis & Cloud</h3>
          <p class="text-xs text-slate-500">Sinkronisasi snapshot database komunitas ke cloud terenkripsi.</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="downloadSnapshot.emit()"
            class="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <mat-icon class="text-sm">file_download</mat-icon> Unduh Snapshot
          </button>
          <button
            type="button"
            (click)="triggerBackup.emit()"
            class="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <mat-icon class="text-sm">backup</mat-icon> Cadangkan Sekarang
          </button>
        </div>
      </div>

      <div class="divide-y divide-slate-100 text-xs">
        @for (b of backups(); track b.id) {
          <div class="py-3 flex items-center justify-between gap-2">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <mat-icon class="text-base">cloud_done</mat-icon>
              </div>
              <div>
                <p class="font-semibold text-slate-900">{{ b.fileName }}</p>
                <p class="text-[11px] text-slate-400">{{ b.createdAt }} • {{ b.destination }}</p>
              </div>
            </div>
            <div class="text-right font-mono text-[11px]">
              <span class="text-slate-600 font-semibold">{{ (b.sizeBytes / 1024).toFixed(1) }} KB</span>
              <p class="text-emerald-600">{{ b.status.toUpperCase() }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class BackupPanelComponent {
  backups = input.required<CloudBackupRecord[]>();
  triggerBackup = output<void>();
  downloadSnapshot = output<void>();
}
