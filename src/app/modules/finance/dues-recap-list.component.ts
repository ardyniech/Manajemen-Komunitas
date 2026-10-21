import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../shared/models/member.model';

@Component({
  selector: 'app-dues-recap-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="divide-y divide-slate-100">
        @for (m of members(); track m.id; let idx = $index) {
          <div class="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/50">
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-6 text-[11px] font-mono text-slate-400 text-center">{{ idx + 1 }}</span>
              <img [src]="m.avatarUrl" class="w-8 h-8 rounded-full bg-slate-100 shrink-0" alt="" referrerpolicy="no-referrer" />
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-900 truncate">{{ m.fullName }}</p>
                <p class="text-[11px] text-slate-500 truncate">{{ m.notes || 'Belum ada data iuran' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[11px] font-mono px-2 py-0.5 rounded-md" [class]="m.status === 'aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'">
                {{ m.status === 'aktif' ? 'Lunas s/d ' + m.duesPaidUntil : 'Belum Lunas' }}
              </span>
              <button type="button" (click)="payClick.emit(m)" class="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                Bayar
              </button>
            </div>
          </div>
        } @empty {
          <div class="p-8 text-center text-xs text-slate-400">Tidak ada anggota yang cocok.</div>
        }
      </div>
    </div>
  `
})
export class DuesRecapListComponent {
  members = input.required<Member[]>();
  payClick = output<Member>();
}
