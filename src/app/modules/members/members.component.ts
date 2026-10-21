import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { membersState, persistAll } from '../../shared/utils/storage';
import { Member, MemberStatus } from '../../shared/models/member.model';
import { MemberToolbarComponent } from './member-toolbar.component';
import { MemberTableComponent } from './member-table.component';
import { MemberDuesModalComponent } from '../finance/member-dues-modal.component';
import { exportToExcel, exportMembersPDF } from '../../shared/utils/export-engine';
import { dispatcher } from '../../core/dispatcher';
import { navigateTo } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-members',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MemberToolbarComponent, MemberTableComponent, MemberDuesModalComponent],
  template: `
    <div class="space-y-5">
      <app-member-toolbar
        [searchTerm]="searchTerm()"
        [selectedStatus]="selectedStatus()"
        (searchChange)="searchTerm.set($event)"
        (statusChange)="selectedStatus.set($event)"
        (openAdd)="navigateToAdd()"
        (openImport)="navigateToImport()"
        (openWaRecap)="navigateToRecap()"
        (exportPDF)="exportPDF()"
        (exportExcel)="exportExcel()"
      />

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <app-member-table
          [members]="filteredMembers()"
          (viewKta)="openKta($event)"
          (toggleStatus)="toggleStatus($event)"
          (payDues)="selectedMemberForPay.set($event)"
          (memberDeleted)="deleteMember($event)"
        />
      </div>

      @if (selectedMemberForPay(); as mem) {
        <app-member-dues-modal
          [member]="mem"
          (closeModal)="selectedMemberForPay.set(null)"
          (paymentSuccess)="selectedMemberForPay.set(null)"
        />
      }
    </div>
  `
})
export class MembersComponent {
  searchTerm = signal('');
  selectedStatus = signal('all');
  selectedMemberForPay = signal<Member | null>(null);

  filteredMembers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const st = this.selectedStatus();
    return membersState().filter(m => {
      const matchSearch = !term || m.fullName.toLowerCase().includes(term) || m.email.toLowerCase().includes(term) || m.memberNumber.toLowerCase().includes(term);
      const matchStatus = st === 'all' || m.status === st;
      return matchSearch && matchStatus;
    });
  });

  navigateToAdd(): void { navigateTo('member-register'); }
  navigateToImport(): void { navigateTo('member-import'); }
  navigateToRecap(): void { navigateTo('member-dues-recap'); }
  openKta(m: Member): void { navigateTo('member-kta', { memberId: m.id }); }

  toggleStatus(m: Member): void {
    const next: MemberStatus = m.status === 'aktif' ? 'nonaktif' : 'aktif';
    membersState.update(list => list.map(item => (item.id === m.id ? { ...item, status: next } : item)));
    persistAll();
  }

  deleteMember(id: string): void {
    membersState.update(list => list.filter(item => item.id !== id));
    persistAll();
    dispatcher.emit('MEMBER_DELETED', { id }, 'members');
  }

  exportPDF(): void { exportMembersPDF(this.filteredMembers()); }
  exportExcel(): void {
    const data = this.filteredMembers().map(m => ({ 'No. Anggota': m.memberNumber, 'Nama Lengkap': m.fullName, 'Email': m.email, 'Telepon': m.phone, 'Tier': m.tier, 'Status': m.status, 'Iuran s/d': m.duesPaidUntil }));
    exportToExcel('laporan_anggota_komunika', data);
  }
}

