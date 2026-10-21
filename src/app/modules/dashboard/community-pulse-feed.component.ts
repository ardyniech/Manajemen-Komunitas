import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { recentActiveThreads, recentNewMembers, pendingFinanceApprovals, approveFinanceTransactionFromPulse } from './community-pulse-service';
import { ForumTopic } from '../../shared/models/forum.model';
import { Member } from '../../shared/models/member.model';

@Component({
  selector: 'app-community-pulse-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-2.5">
      @if (activeTab() === 'threads') {
        @for (topic of threads(); track topic.id) {
          <div class="p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-200/70 transition-all flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1 flex items-start gap-2.5">
              <img [src]="topic.authorAvatar" [alt]="topic.authorName" class="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0 mt-0.5" referrerpolicy="no-referrer" />
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/80">{{ topic.category }}</span>
                  <span class="text-[11px] text-slate-500 font-medium">Oleh {{ topic.authorName }}</span>
                </div>
                <button type="button" (click)="selectTopic.emit(topic)" class="text-left text-xs font-bold text-slate-900 hover:text-indigo-600 truncate mt-0.5 block w-full focus:outline-none">
                  {{ topic.title }}
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-lg flex items-center gap-1">
                <mat-icon class="text-xs text-indigo-500">forum</mat-icon>
                <span>{{ topic.comments.length }} Diskusi</span>
              </span>
              <button type="button" (click)="selectTopic.emit(topic)" class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors" title="Buka Thread">
                <mat-icon class="text-sm">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        } @empty {
          <p class="text-xs text-slate-400 py-4 text-center">Belum ada aktivitas forum terkini.</p>
        }
      } @else if (activeTab() === 'members') {
        @for (m of members(); track m.id) {
          <div class="p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-2xl border border-slate-200/70 transition-all flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1 flex items-center gap-2.5">
              <img [src]="m.avatarUrl" [alt]="m.fullName" class="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0" referrerpolicy="no-referrer" />
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <h4 class="text-xs font-bold text-slate-900 truncate">{{ m.fullName }}</h4>
                  <span class="text-[10px] font-mono text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">{{ m.memberNumber }}</span>
                </div>
                <p class="text-[10px] text-slate-500 mt-0.5">Bergabung: {{ m.joinedAt }} · Status: <span class="capitalize font-semibold text-emerald-700">{{ m.status }}</span></p>
              </div>
            </div>
            <button type="button" (click)="selectMember.emit(m)" class="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors flex items-center gap-1 shrink-0">
              <mat-icon class="text-xs text-indigo-600">badge</mat-icon>
              <span>Profil</span>
            </button>
          </div>
        } @empty {
          <p class="text-xs text-slate-400 py-4 text-center">Belum ada pendaftaran anggota baru.</p>
        }
      } @else if (activeTab() === 'finance') {
        @for (tx of pendingFinance(); track tx.id) {
          <div class="p-3 bg-amber-50/40 hover:bg-amber-50/80 rounded-2xl border border-amber-200/70 transition-all flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">{{ tx.category }}</span>
                <span class="text-[10px] font-mono text-slate-500">#{{ tx.transactionNumber }}</span>
              </div>
              <h4 class="text-xs font-bold text-slate-900 truncate mt-0.5">{{ tx.title }}</h4>
              <p class="text-[10px] text-slate-500">{{ tx.memberName || 'Anggota' }} · <span class="font-bold text-amber-900">Rp {{ tx.amount.toLocaleString('id-ID') }}</span></p>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button type="button" (click)="approveTx(tx.id)" class="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1 transition-all">
                <mat-icon class="text-xs">check_circle</mat-icon>
                <span>Setujui</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl flex items-center gap-2.5 text-emerald-950 text-xs font-semibold">
            <mat-icon class="text-emerald-600 text-base shrink-0">verified</mat-icon>
            <span>Semua tagihan & pengeluaran kas telah terverifikasi lunas!</span>
          </div>
        }
      }
    </div>
  `
})
export class CommunityPulseFeedComponent {
  activeTab = input.required<'threads' | 'members' | 'finance'>();
  selectTopic = output<ForumTopic>();
  selectMember = output<Member>();
  openFinance = output<void>();

  threads = recentActiveThreads;
  members = recentNewMembers;
  pendingFinance = pendingFinanceApprovals;

  approveTx(txId: string): void {
    approveFinanceTransactionFromPulse(txId);
  }
}
