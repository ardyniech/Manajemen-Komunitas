import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '../../shared/models/member.model';
import { UserRole } from '../../shared/models/role.model';

@Component({
  selector: 'app-role-user-assignment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">Penugasan Peran Pengguna</h3>
          <p class="text-[11px] text-slate-500">Tetapkan peran pengurus atau anggota langsung dari daftar pengguna aktif.</p>
        </div>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
          {{ members().length }} Anggota Terdaftar
        </span>
      </div>

      <div class="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        @for (m of members(); track m.id) {
          <div class="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-xs">
            <div class="flex items-center gap-3 min-w-0">
              <img [src]="m.avatarUrl" class="w-8 h-8 rounded-full object-cover shrink-0" alt="Avatar" referrerpolicy="no-referrer" />
              <div class="min-w-0">
                <p class="font-semibold text-slate-900 truncate">{{ m.fullName }}</p>
                <p class="text-[11px] text-slate-400 font-mono">{{ m.email }} • {{ m.memberNumber }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <select
                aria-label="Pilih peran pengguna"
                [value]="m.roleId"
                (change)="onRoleChange(m.id, $any($event.target).value)"
                class="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                @for (r of roles(); track r.id) {
                  <option [value]="r.id">{{ r.name }}</option>
                }
              </select>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class RoleUserAssignmentComponent {
  members = input.required<Member[]>();
  roles = input.required<UserRole[]>();
  assignRole = output<{ memberId: string; roleId: string }>();

  onRoleChange(memberId: string, roleId: string): void {
    this.assignRole.emit({ memberId, roleId });
  }
}
