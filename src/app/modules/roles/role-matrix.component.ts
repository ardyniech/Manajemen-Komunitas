import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserRole, AppPermission } from '../../shared/models/role.model';

@Component({
  selector: 'app-role-matrix',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">Matriks Izin Akses Komprehensif</h3>
          <p class="text-[11px] text-slate-500">Perbandingan hak akses lintas peran kepengurusan dan anggota.</p>
        </div>
        <span class="text-[10px] text-slate-400 font-mono">Total Peran: {{ roles().length }}</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-100 text-[11px] text-slate-500 font-semibold">
              <th class="py-2.5 px-4">Nama Izin / Modul</th>
              @for (r of roles(); track r.id) {
                <th class="py-2.5 px-3 text-center">
                  <div class="inline-flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full" [style.backgroundColor]="r.color"></span>
                    <span class="font-bold text-slate-800">{{ r.name }}</span>
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (perm of allPermissions; track perm.key) {
              <tr class="hover:bg-slate-50/60 transition-colors">
                <td class="py-2.5 px-4 font-medium text-slate-800 flex flex-col">
                  <span>{{ perm.label }}</span>
                  <span class="text-[10px] text-slate-400 font-mono">{{ perm.key }}</span>
                </td>
                @for (r of roles(); track r.id) {
                  <td class="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      [disabled]="r.code === 'super_admin'"
                      (click)="togglePermission.emit({ roleId: r.id, permission: perm.key })"
                      [title]="r.code === 'super_admin' ? 'Izin Super Admin terkunci (akses penuh)' : 'Klik untuk mengubah izin'"
                      [class]="hasPermission(r, perm.key) ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 ring-1 ring-indigo-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'"
                      class="w-6 h-6 rounded-lg inline-flex items-center justify-center transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <mat-icon class="text-sm leading-none">{{ hasPermission(r, perm.key) ? 'check' : 'close' }}</mat-icon>
                    </button>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RoleMatrixComponent {
  roles = input.required<UserRole[]>();
  togglePermission = output<{ roleId: string; permission: AppPermission }>();

  allPermissions: { key: AppPermission; label: string }[] = [
    { key: 'manage_members', label: 'Kelola Direktori Anggota (Tambah/Edit/Hapus)' },
    { key: 'view_members', label: 'Lihat Direktori Anggota' },
    { key: 'manage_finance', label: 'Kelola Buku Kas & Pembayaran Iuran' },
    { key: 'view_finance', label: 'Lihat Ringkasan Kas & Riwayat Iuran' },
    { key: 'moderate_forum', label: 'Moderasi Diskusi & Hapus Komentar' },
    { key: 'post_forum', label: 'Buat Topik Baru & Berkomentar' },
    { key: 'export_reports', label: 'Ekspor Laporan PDF & File Excel' },
    { key: 'manage_roles', label: 'Konfigurasi Hak Akses & Peran (RBAC)' },
    { key: 'manage_settings', label: 'Ubah Profil & Rekening Komunitas' },
    { key: 'trigger_backup', label: 'Trigger Snapshot & Sinkronisasi Cloud' }
  ];

  hasPermission(role: UserRole, perm: AppPermission): boolean {
    return role.permissions.includes(perm);
  }
}
