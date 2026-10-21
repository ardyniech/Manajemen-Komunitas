import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppModal } from '../../shared/atoms/modal.component';
import { Member, MemberTier, MemberStatus } from '../../shared/models/member.model';

@Component({
  selector: 'app-member-form-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AppModal],
  template: `
    <app-modal [isOpen]="isOpen()" title="Pendaftaran Anggota Komunitas" subtitle="Input data keanggotaan baru" (dismiss)="modalClose.emit()">
      <form [formGroup]="form" class="space-y-4">
        <div>
          <label for="mem-fullName" class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
          <input id="mem-fullName" formControlName="fullName" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Budi Santoso" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="mem-email" class="block text-xs font-semibold text-slate-700 mb-1">Email Aktif *</label>
            <input id="mem-email" formControlName="email" type="email" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="nama@domain.com" />
          </div>
          <div>
            <label for="mem-phone" class="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
            <input id="mem-phone" formControlName="phone" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="+62 812-xxxx" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="mem-tier" class="block text-xs font-semibold text-slate-700 mb-1">Tier Keanggotaan</label>
            <select id="mem-tier" formControlName="tier" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
              <option value="reguler">Reguler</option>
              <option value="pengurus">Pengurus</option>
              <option value="vip">VIP</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <div>
            <label for="mem-status" class="block text-xs font-semibold text-slate-700 mb-1">Status Keanggotaan</label>
            <select id="mem-status" formControlName="status" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
              <option value="aktif">Aktif</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <div>
          <label for="mem-notes" class="block text-xs font-semibold text-slate-700 mb-1">Catatan Khusus</label>
          <input id="mem-notes" formControlName="notes" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="Divisi atau keahlian khusus..." />
        </div>
      </form>

      <div footer class="flex items-center gap-2">
        <button type="button" (click)="modalClose.emit()" class="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">Batal</button>
        <button type="button" [disabled]="form.invalid" (click)="onSubmit()" class="px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">Simpan Anggota</button>
      </div>
    </app-modal>
  `
})
export class MemberFormModalComponent {
  isOpen = input.required<boolean>();
  modalClose = output<void>();
  save = output<Partial<Member>>();

  form = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    tier: new FormControl<MemberTier>('reguler', [Validators.required]),
    status: new FormControl<MemberStatus>('aktif', [Validators.required]),
    notes: new FormControl('')
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.save.emit(this.form.value as Partial<Member>);
    this.form.reset({ tier: 'reguler', status: 'aktif' });
  }
}
