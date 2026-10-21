import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommunityEvent, EventCategory } from '../../shared/models/calendar.model';
import { currentUser } from '../../core/auth/auth.service';

@Component({
  selector: 'app-event-form-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><mat-icon class="text-lg">event_available</mat-icon></span>
            <h3 class="font-bold text-slate-800 text-sm">Tambah Agenda Kegiatan Baru</h3>
          </div>
          <button type="button" (click)="modalClose.emit()" class="text-slate-400 hover:text-slate-600 p-1"><mat-icon class="text-lg">close</mat-icon></button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-3 space-y-3">
          <div>
            <label for="evt-title" class="block text-xs font-semibold text-slate-700 mb-1">Judul Kegiatan *</label>
            <input id="evt-title" type="text" formControlName="title" placeholder="Contoh: Rapat Pleno Komunitas" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="evt-cat" class="block text-xs font-semibold text-slate-700 mb-1">Kategori *</label>
              <select id="evt-cat" formControlName="category" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none">
                <option value="gathering">Gathering</option>
                <option value="workshop">Workshop</option>
                <option value="rapat">Rapat Pleno</option>
                <option value="sosial">Bakti Sosial</option>
                <option value="olahraga">Olahraga</option>
                <option value="keuangan">Keuangan</option>
              </select>
            </div>
            <div>
              <label for="evt-cap" class="block text-xs font-semibold text-slate-700 mb-1">Kapasitas Maksimal</label>
              <input id="evt-cap" type="number" formControlName="maxCapacity" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="evt-sdate" class="block text-xs font-semibold text-slate-700 mb-1">Tgl Mulai *</label>
              <input id="evt-sdate" type="date" formControlName="startDate" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" />
            </div>
            <div>
              <label for="evt-stime" class="block text-xs font-semibold text-slate-700 mb-1">Jam Mulai *</label>
              <input id="evt-stime" type="time" formControlName="startTime" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="evt-edate" class="block text-xs font-semibold text-slate-700 mb-1">Tgl Selesai *</label>
              <input id="evt-edate" type="date" formControlName="endDate" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" />
            </div>
            <div>
              <label for="evt-etime" class="block text-xs font-semibold text-slate-700 mb-1">Jam Selesai *</label>
              <input id="evt-etime" type="time" formControlName="endTime" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" />
            </div>
          </div>

          <div>
            <label for="evt-loc" class="block text-xs font-semibold text-slate-700 mb-1">Lokasi Fisik / Gedung *</label>
            <input id="evt-loc" type="text" formControlName="location" placeholder="Contoh: Gedung Aula Komunitas Lt. 2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" />
          </div>

          <div>
            <label for="evt-desc" class="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Kegiatan *</label>
            <textarea id="evt-desc" formControlName="description" rows="3" placeholder="Tuliskan tujuan dan agenda..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"></textarea>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" (click)="modalClose.emit()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">Batal</button>
            <button type="submit" [disabled]="form.invalid" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5">
              <mat-icon class="text-sm">check</mat-icon><span>Terbitkan Agenda</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EventFormModalComponent {
  modalClose = output<void>();
  save = output<Omit<CommunityEvent, 'id' | 'createdAt' | 'attendees'>>();
  user = currentUser;

  form = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl<EventCategory>('gathering', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    startDate: new FormControl<string>(new Date().toISOString().split('T')[0], { nonNullable: true, validators: [Validators.required] }),
    startTime: new FormControl<string>('09:00', { nonNullable: true, validators: [Validators.required] }),
    endDate: new FormControl<string>(new Date().toISOString().split('T')[0], { nonNullable: true, validators: [Validators.required] }),
    endTime: new FormControl<string>('12:00', { nonNullable: true, validators: [Validators.required] }),
    isOnline: new FormControl<boolean>(false, { nonNullable: true }),
    location: new FormControl<string>('Sekretariat Komunika', { nonNullable: true, validators: [Validators.required] }),
    onlineMeetingUrl: new FormControl<string>(''),
    coverImage: new FormControl<string>('https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80'),
    maxCapacity: new FormControl<number>(100, { nonNullable: true }),
    reminderMinutesBefore: new FormControl<number>(1440, { nonNullable: true })
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const u = this.user();
    this.save.emit({
      title: v.title, category: v.category, description: v.description,
      startDate: v.startDate, startTime: v.startTime, endDate: v.endDate, endTime: v.endTime,
      isOnline: v.isOnline, location: v.location, onlineMeetingUrl: v.onlineMeetingUrl || undefined,
      coverImage: v.coverImage || undefined, maxCapacity: v.maxCapacity, reminderMinutesBefore: v.reminderMinutesBefore,
      organizerId: u.id, organizerName: u.fullName, organizerRole: u.roleTitle
    });
  }
}
