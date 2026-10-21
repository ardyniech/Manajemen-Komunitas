import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppStatCard } from '../../shared/atoms/stat-card.component';

@Component({
  selector: 'app-finance-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppStatCard],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <app-stat-card
        label="Total Saldo Kas"
        [value]="'Rp ' + balance().toLocaleString('id-ID')"
        icon="account_balance_wallet"
        subtext="saldo aktif di rekening kas"
        tone="indigo"
      />
      <app-stat-card
        label="Total Pemasukan"
        [value]="'Rp ' + income().toLocaleString('id-ID')"
        icon="arrow_circle_down"
        subtext="iuran anggota & sponsor"
        tone="emerald"
      />
      <app-stat-card
        label="Total Pengeluaran"
        [value]="'Rp ' + expense().toLocaleString('id-ID')"
        icon="arrow_circle_up"
        subtext="operasional & event"
        tone="rose"
      />
    </div>
  `
})
export class FinanceSummaryComponent {
  balance = input.required<number>();
  income = input.required<number>();
  expense = input.required<number>();
}
