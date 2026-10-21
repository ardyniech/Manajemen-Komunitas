import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { membersState, persistAll } from '../../shared/utils/storage';
import { Member } from '../../shared/models/member.model';
import { navigateTo } from '../../core/navigation/navigation.service';
import { dispatcher } from '../../core/dispatcher';
import { computeMemberPersonalityMetadata } from '../../core/talent/member-metadata-calculation.service';

@Component({
  selector: 'app-member-register-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="flex items-center gap-3">
        <button type="button" (click)="goBack()" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
          <mat-icon class="text-base">arrow_back</mat-icon>
        </button>
        <div>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Formulir Pendaftaran Anggota Baru</h2>
          <p class="text-xs text-slate-500">Otomatis mengalkulasi metadata Weton, Shio & Zodiak secara terenkripsi.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="reg-name" class="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
              <input id="reg-name" formControlName="fullName" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="e.g. Rian Pratama" />
            </div>
            <div>
              <label for="reg-email" class="block text-xs font-semibold text-slate-700 mb-1">Alamat Email *</label>
              <input id="reg-email" formControlName="email" type="email" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="nama@email.com" />
            </div>
            <div>
              <label for="reg-bdate" class="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
              <input id="reg-bdate" formControlName="birthDate" type="date" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" />
            </div>
            <div>
              <label for="reg-phone" class="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
              <input id="reg-phone" formControlName="phone" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="0812-xxxx-xxxx" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="reg-tier" class="block text-xs font-semibold text-slate-700 mb-1">Tingkat Keanggotaan</label>
              <select id="reg-tier" formControlName="tier" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white">
                <option value="reguler">Reguler</option>
                <option value="vip">VIP</option>
                <option value="pengurus">Pengurus Inti</option>
              </select>
            </div>
            <div>
              <label for="reg-address" class="block text-xs font-semibold text-slate-700 mb-1">Domisili / Kota</label>
              <input id="reg-address" formControlName="address" type="text" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200" placeholder="Kota, Provinsi" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" (click)="goBack()" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">Batal</button>
            <button type="submit" [disabled]="form.invalid" class="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">Simpan & Terbitkan Anggota</button>
          </div>
        </form>

        <div class="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between h-64 border border-indigo-500/20">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-[9px] uppercase tracking-widest text-indigo-300 font-bold block">Kartu Tanda Anggota</span>
              <h4 class="font-bold text-sm tracking-tight text-white">KOMUNIKA OS</h4>
            </div>
            <mat-icon class="text-indigo-400 text-2xl">qr_code_2</mat-icon>
          </div>
          <div>
            <p class="text-xs font-bold text-white tracking-wide truncate">{{ form.value.fullName || 'Nama Lengkap' }}</p>
            <p class="text-[10px] text-slate-300 font-mono">{{ form.value.email || 'email@komunika.id' }}</p>
            <span class="inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">{{ form.value.tier }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MemberRegisterPageComponent {
  form = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('1994-06-18', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(8)]),
    tier: new FormControl<'reguler' | 'vip' | 'pengurus'>('reguler'),
    address: new FormControl('Bandung, Jawa Barat')
  });

  goBack(): void { navigateTo('members'); }

  onSubmit(): void {
    if (this.form.invalid) return;
    const val = this.form.getRawValue();
    const bdate = val.birthDate || '1994-06-18';
    const newMember: Member = {
      id: `mem-${Date.now()}`,
      memberNumber: `KOM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: val.fullName ?? '',
      email: val.email ?? '',
      phone: val.phone ?? '',
      roleId: val.tier === 'pengurus' ? 'role-moderator' : 'role-anggota',
      tier: val.tier ?? 'reguler',
      status: 'aktif',
      joinedAt: new Date().toISOString().split('T')[0],
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      duesPaidUntil: '2026-12-31',
      twoFactorActive: false,
      notes: val.address ?? 'Indonesia',
      hiddenMetadata: computeMemberPersonalityMetadata(bdate)
    };
    membersState.update(list => [newMember, ...list]);
    persistAll();
    dispatcher.emit('MEMBER_REGISTERED', newMember, 'members');
    navigateTo('members');
  }
}
