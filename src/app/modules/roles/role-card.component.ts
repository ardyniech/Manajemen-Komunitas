import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserRole, AppPermission } from '../../shared/models/role.model';

@Component({
  selector: 'app-role-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-3.5 h-3.5 rounded-full" [style.backgroundColor]="role().color"></div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">{{ role().name }}</h3>
            <p class="text-[11px] text-slate-400">{{ role().description }}</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
          {{ role().memberCount }} Anggota
        </span>
      </div>

      <div class="border-t border-slate-100 pt-3">
        <h4 class="text-[11px] font-bold uppercase text-slate-400 mb-2">Hak Akses Modul</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          @for (perm of allPermissions; track perm.key) {
            <label class="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                [checked]="hasPermission(perm.key)"
                [disabled]="role().code === 'super_admin'"
                (change)="togglePermission.emit({ roleId: role().id, permission: perm.key })"
                class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
              />
              <span class="text-slate-700 font-medium">{{ perm.label }}</span>
            </label>
          }
        </div>
      </div>
    </div>
  `
})
export class RoleCardComponent {
  role = input.required<UserRole>();
  togglePermission = output<{ roleId: string; permission: AppPermission }>();

  allPermissions: { key: AppPermission; label: string }[] = [
    { key: 'manage_members', label: 'Kelola Anggota (CRUD)' },
    { key: 'manage_finance', label: 'Kelola Buku Kas & Iuran' },
    { key: 'moderate_forum', label: 'Moderasi Forum Diskusi' },
    { key: 'export_reports', label: 'Ekspor PDF & Excel' },
    { key: 'manage_roles', label: 'Ubah Hak Akses Peran' },
    { key: 'manage_settings', label: 'Konfigurasi Komunitas' },
    { key: 'trigger_backup', label: 'Trigger Cloud Backup' }
  ];

  hasPermission(perm: AppPermission): boolean {
    return this.role().permissions.includes(perm);
  }
}
