import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { membersState, persistAll } from '../../shared/utils/storage';
import { Member } from '../../shared/models/member.model';
import { navigateTo } from '../../core/navigation/navigation.service';
import { dispatcher } from '../../core/dispatcher';

@Component({
  selector: 'app-member-import-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="flex items-center gap-3">
        <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <mat-icon class="text-base">arrow_back</mat-icon>
        </button>
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Impor Masal & Migrasi Anggota (CSV)</h2>
          <p class="text-xs text-slate-500">Unggah berkas spreadsheet/CSV untuk mendaftarkan banyak anggota sekaligus.</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <!-- Drag & Drop Area -->
        <div class="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors">
          <mat-icon class="text-4xl text-slate-400 mb-2">upload_file</mat-icon>
          <h4 class="text-xs font-bold text-slate-800">Pilih Berkas CSV Komunitas</h4>
          <p class="text-[11px] text-slate-500 mb-4">Format kolom: nama_lengkap, email, telepon, tier, domisili</p>
          <input #fileInput type="file" accept=".csv" (change)="onFileSelected($event)" class="hidden" />
          <button type="button" (click)="fileInput.click()" class="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100">
            Telusuri Dokumen
          </button>
        </div>

        @if (parsedRows().length > 0) {
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800">Pratinjau Data ({{ parsedRows().length }} Baris Siap Diimpor)</span>
              <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Validasi Berhasil</span>
            </div>
            <div class="overflow-x-auto border border-slate-100 rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                  <tr>
                    <th class="p-2.5">Nama</th>
                    <th class="p-2.5">Email</th>
                    <th class="p-2.5">Telepon</th>
                    <th class="p-2.5">Tier</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (r of parsedRows(); track r.email) {
                    <tr>
                      <td class="p-2.5 font-semibold text-slate-900">{{ r.name }}</td>
                      <td class="p-2.5 text-slate-600">{{ r.email }}</td>
                      <td class="p-2.5 text-slate-600">{{ r.phone }}</td>
                      <td class="p-2.5"><span class="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700">{{ r.tier }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" (click)="parsedRows.set([])" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600">Reset</button>
              <button type="button" (click)="commitImport()" class="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800">Eksekusi Impor Masal</button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MemberImportPageComponent {
  parsedRows = signal<{ name: string; email: string; phone: string; tier: 'reguler' | 'vip' | 'pengurus' }[]>([
    { name: 'Bambang Sutejo', email: 'bambang@perkumpulan.id', phone: '081298765432', tier: 'reguler' },
    { name: 'Citra Dewi', email: 'citra@perkumpulan.id', phone: '081377889900', tier: 'vip' },
    { name: 'Doni Pratama', email: 'doni@perkumpulan.id', phone: '085611223344', tier: 'reguler' }
  ]);

  goBack(): void { navigateTo('members'); }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // simulate instant CSV parsing
      this.parsedRows.set([
        { name: 'Hendra Gunawan', email: 'hendra@komunika.org', phone: '081122334455', tier: 'reguler' },
        { name: 'Maya Safira', email: 'maya@komunika.org', phone: '081987654321', tier: 'vip' }
      ]);
    }
  }

  commitImport(): void {
    const newMembers: Member[] = this.parsedRows().map((row, idx) => ({
      id: `mem-csv-${Date.now()}-${idx}`,
      memberNumber: `KOM-CSV-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: row.name,
      email: row.email,
      phone: row.phone,
      roleId: row.tier === 'pengurus' ? 'role-moderator' : 'role-anggota',
      tier: row.tier,
      status: 'aktif',
      joinedAt: new Date().toISOString().split('T')[0],
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      duesPaidUntil: '2026-12-31',
      twoFactorActive: false,
      notes: 'Imported from CSV'
    }));

    membersState.update(curr => [...newMembers, ...curr]);
    persistAll();
    dispatcher.emit('MEMBER_REGISTERED', newMembers, 'members-import');
    navigateTo('members');
  }
}
