import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppBadge } from '../../shared/atoms/badge.component';
import { FinanceTransaction } from '../../shared/models/finance.model';
import { ForumTopic } from '../../shared/models/forum.model';

@Component({
  selector: 'app-dashboard-recents',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, AppBadge],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Transaksi Terkini -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <mat-icon class="text-lg">receipt_long</mat-icon>
            </div>
            <h3 class="font-semibold text-slate-900 text-sm">Transaksi Kas Terkini</h3>
          </div>
          <span class="text-xs text-slate-500 font-medium">Buku Kas Utama</span>
        </div>

        <div class="divide-y divide-slate-100">
          @for (tx of transactions(); track tx.id) {
            <div class="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div>
                <p class="font-medium text-slate-800">{{ tx.title }}</p>
                <p class="text-slate-400 text-[11px] mt-0.5">{{ tx.date }} • {{ tx.category }}</p>
              </div>
              <div class="text-right">
                <p [class]="tx.type === 'pengeluaran' ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'">
                  {{ tx.type === 'pengeluaran' ? '-' : '+' }} Rp {{ tx.amount.toLocaleString('id-ID') }}
                </p>
                <span class="text-[10px] text-slate-400 uppercase tracking-wider">{{ tx.method }}</span>
              </div>
            </div>
          } @empty {
            <p class="text-xs text-slate-400 py-4 text-center">Belum ada transaksi</p>
          }
        </div>
      </div>

      <!-- Diskusi Komunitas Terbaru -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <mat-icon class="text-lg">chat</mat-icon>
            </div>
            <h3 class="font-semibold text-slate-900 text-sm">Diskusi Komunitas Terbaru</h3>
          </div>
          <span class="text-xs text-slate-500 font-medium">Internal Feed</span>
        </div>

        <div class="space-y-3">
          @for (top of topics(); track top.id) {
            <div class="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start gap-3 text-xs">
              <img [src]="top.authorAvatar" class="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" alt="Avatar" referrerpolicy="no-referrer" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 mb-1">
                  @if (top.isPinned) {
                    <app-badge variant="danger">PINNED</app-badge>
                  }
                  <app-badge variant="info">{{ top.category }}</app-badge>
                  <span class="text-[11px] text-slate-400">{{ top.authorName }}</span>
                </div>
                <h4 class="font-semibold text-slate-800 truncate">{{ top.title }}</h4>
                <p class="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{{ top.content }}</p>
              </div>
            </div>
          } @empty {
            <p class="text-xs text-slate-400 py-4 text-center">Belum ada diskusi topik</p>
          }
        </div>
      </div>
    </div>
  `
})
export class DashboardRecentsComponent {
  transactions = input.required<FinanceTransaction[]>();
  topics = input.required<ForumTopic[]>();
}
