import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { rolesState, membersState, persistAll } from '../../shared/utils/storage';
import { RoleCardComponent } from './role-card.component';
import { RoleMatrixComponent } from './role-matrix.component';
import { RoleUserAssignmentComponent } from './role-user-assignment.component';
import { AppPermission } from '../../shared/models/role.model';
import { dispatcher } from '../../core/dispatcher';

@Component({
  selector: 'app-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, RoleCardComponent, RoleMatrixComponent, RoleUserAssignmentComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Manajemen Hak Akses & Peran (RBAC)</h2>
          <p class="text-xs text-slate-500">Konfigurasikan batas hak akses per tingkat hierarki kepengurusan komunitas dan anggota.</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              type="button"
              (click)="activeView.set('cards')"
              [class]="activeView() === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'"
              class="px-3 py-1.5 rounded-lg transition-all"
            >
              Kartu Peran
            </button>
            <button
              type="button"
              (click)="activeView.set('matrix')"
              [class]="activeView() === 'matrix' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'"
              class="px-3 py-1.5 rounded-lg transition-all"
            >
              Matriks Izin
            </button>
            <button
              type="button"
              (click)="activeView.set('assign')"
              [class]="activeView() === 'assign' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'"
              class="px-3 py-1.5 rounded-lg transition-all"
            >
              Penugasan Pengguna
            </button>
          </div>
        </div>
      </div>

      @if (activeView() === 'cards') {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          @for (r of rolesState(); track r.id) {
            <app-role-card [role]="r" (togglePermission)="onTogglePermission($event)" />
          }
        </div>
      } @else if (activeView() === 'matrix') {
        <app-role-matrix [roles]="rolesState()" (togglePermission)="onTogglePermission($event)" />
      } @else {
        <app-role-user-assignment
          [members]="membersState()"
          [roles]="rolesState()"
          (assignRole)="onAssignRole($event)"
        />
      }
    </div>
  `
})
export class RolesComponent {
  rolesState = rolesState;
  membersState = membersState;
  activeView = signal<'cards' | 'matrix' | 'assign'>('cards');

  onTogglePermission(event: { roleId: string; permission: AppPermission }): void {
    rolesState.update(list =>
      list.map(r => {
        if (r.id !== event.roleId) return r;
        const exists = r.permissions.includes(event.permission);
        const nextPerms = exists ? r.permissions.filter(p => p !== event.permission) : [...r.permissions, event.permission];
        return { ...r, permissions: nextPerms };
      })
    );
    persistAll();
    dispatcher.emit('ROLE_UPDATED', event, 'roles');
  }

  onAssignRole(event: { memberId: string; roleId: string }): void {
    membersState.update(list =>
      list.map(m => (m.id === event.memberId ? { ...m, roleId: event.roleId } : m))
    );
    // Update role member count
    rolesState.update(rList =>
      rList.map(r => {
        const count = membersState().filter(m => m.roleId === r.id).length;
        return { ...r, memberCount: count };
      })
    );
    persistAll();
    dispatcher.emit('MEMBER_UPDATED', event, 'roles');
  }
}
