import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MemberHiddenPersonalityMetadata } from '../../shared/models/member.model';

@Component({
  selector: 'app-member-hidden-metadata-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (metadata(); as meta) {
      <div class="p-3 bg-gradient-to-r from-amber-50/90 via-purple-50/70 to-indigo-50/80 rounded-xl text-slate-800 text-xs shadow-xs space-y-2 border border-purple-200/80">
        <div class="flex items-center justify-between border-b border-purple-200/60 pb-1.5">
          <div class="flex items-center gap-1.5">
            <mat-icon class="text-amber-600 text-sm">lock</mat-icon>
            <span class="font-bold text-[11px] text-purple-900">Metadata Rahasia Dewan Etik & Admin</span>
          </div>
          <span class="text-[9px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200 font-bold">CONFIDENTIAL</span>
        </div>

        <div class="grid grid-cols-3 gap-2 text-[10px]">
          <div class="bg-white/80 p-2 rounded-lg border border-purple-100">
            <span class="text-amber-800 block font-bold">Weton Jawa</span>
            <span class="font-bold text-slate-900 text-[11px] block mt-0.5">{{ meta.wetonFull }}</span>
            <span class="text-slate-500">Neptu {{ meta.wetonNeptu }} ({{ meta.wetonDinten }} + {{ meta.wetonPasaran }})</span>
          </div>

          <div class="bg-white/80 p-2 rounded-lg border border-purple-100">
            <span class="text-sky-800 block font-bold">Shio Tionghoa</span>
            <span class="font-bold text-slate-900 text-[11px] block mt-0.5">Shio {{ meta.chineseShio }}</span>
            <span class="text-slate-500">Unsur {{ meta.shioElement }}</span>
          </div>

          <div class="bg-white/80 p-2 rounded-lg border border-purple-100">
            <span class="text-indigo-800 block font-bold">Zodiak Barat</span>
            <span class="font-bold text-slate-900 text-[11px] block mt-0.5">{{ meta.westernZodiac }}</span>
            <span class="text-slate-500">Elemen {{ meta.zodiacElement }}</span>
          </div>
        </div>
      </div>
    }
  `
})
export class MemberHiddenMetadataPanelComponent {
  metadata = input<MemberHiddenPersonalityMetadata | undefined>();
}
