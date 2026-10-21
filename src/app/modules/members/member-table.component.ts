import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '../../shared/models/member.model';
import { AppBadge } from '../../shared/atoms/badge.component';
import { MemberHiddenMetadataPanelComponent } from './member-hidden-metadata-panel.component';

@Component({
  selector: 'app-member-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppBadge, MemberHiddenMetadataPanelComponent],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-600">
        <thead class="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/70">
          <tr>
            <th class="py-3 px-4">Anggota & Weton</th>
            <th class="py-3 px-4">No. Anggota</th>
            <th class="py-3 px-4">Kontak</th>
            <th class="py-3 px-4">Tier & Status</th>
            <th class="py-3 px-4">Iuran Terbayar</th>
            <th class="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          @for (m of members(); track m.id) {
            <tr class="hover:bg-slate-50/50 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <img [src]="m.avatarUrl" class="w-8 h-8 rounded-full bg-slate-100 object-cover" alt="Avatar" referrerpolicy="no-referrer" />
                  <div>
                    <p class="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{{ m.fullName }}</span>
                      @if (m.hiddenMetadata; as meta) {
                        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/80">
                          {{ meta.wetonFull }} • {{ meta.westernZodiac }}
                        </span>
                      }
                    </p>
                    <p class="text-[11px] text-slate-400">Bergabung {{ m.joinedAt }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 font-mono font-medium text-slate-900">{{ m.memberNumber }}</td>
              <td class="py-3 px-4">
                <p class="text-slate-800">{{ m.email }}</p>
                <p class="text-[11px] text-slate-400">{{ m.phone }}</p>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <app-badge [variant]="m.tier === 'pengurus' ? 'info' : m.tier === 'vip' ? 'warning' : 'neutral'">
                    {{ m.tier | uppercase }}
                  </app-badge>
                  @if (m.status === 'aktif') { <app-badge variant="success">AKTIF</app-badge> }
                  @else if (m.status === 'pending') { <app-badge variant="warning">PENDING</app-badge> }
                  @else { <app-badge variant="danger">NONAKTIF</app-badge> }
                </div>
              </td>
              <td class="py-3 px-4">
                <p class="font-mono text-xs text-slate-700 font-medium">s/d {{ m.duesPaidUntil }}</p>
                <p class="text-[10px] text-slate-400 truncate max-w-[150px]">{{ m.notes || 'Belum ada data' }}</p>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button type="button" (click)="toggleMetadata(m.id)" title="Metadata Rahasia" class="p-1 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50">
                    <mat-icon class="text-base">lock_open</mat-icon>
                  </button>
                  <button type="button" (click)="payDues.emit(m)" title="Iuran Kas" class="p-1 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50">
                    <mat-icon class="text-base">payments</mat-icon>
                  </button>
                  <button type="button" (click)="viewKta.emit(m)" title="KTA Digital" class="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                    <mat-icon class="text-base">badge</mat-icon>
                  </button>
                  <button type="button" (click)="memberDeleted.emit(m.id)" title="Hapus" class="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50">
                    <mat-icon class="text-base">delete_outline</mat-icon>
                  </button>
                </div>
              </td>
            </tr>

            @if (expandedMetaId() === m.id && m.hiddenMetadata) {
              <tr class="bg-slate-900/5">
                <td colspan="6" class="p-3">
                  <app-member-hidden-metadata-panel [metadata]="m.hiddenMetadata" />
                </td>
              </tr>
            }
          } @empty {
            <tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada anggota yang cocok.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class MemberTableComponent {
  members = input.required<Member[]>();
  memberDeleted = output<string>();
  toggleStatus = output<Member>();
  payDues = output<Member>();
  viewKta = output<Member>();

  expandedMetaId = signal<string | null>(null);

  toggleMetadata(id: string): void {
    this.expandedMetaId.update(curr => curr === id ? null : id);
  }
}
