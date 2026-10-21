import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppStatCard } from '../../shared/atoms/stat-card.component';

@Component({
  selector: 'app-dashboard-kpis',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppStatCard],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <app-stat-card
        class="animate-fade-in-up stagger-1 block"
        label="Total Anggota"
        [value]="totalMembers().toString()"
        icon="groups"
        subtext="orang terdaftar"
        infoTooltip="Akumulasi seluruh anggota warga terdaftar di database termasuk status aktif dan pasif."
        trend="up"
        trendValue="+12%"
        tone="indigo"
      />
      <app-stat-card
        class="animate-fade-in-up stagger-2 block"
        label="Saldo Kas"
        [value]="formattedBalance()"
        icon="account_balance_wallet"
        subtext="total kas bersih"
        infoTooltip="Saldo kas riil organisasi setelah rekonsiliasi seluruh pemasukan dan pengeluaran terverifikasi."
        trend="up"
        trendValue="+8.4%"
        tone="emerald"
      />
      <app-stat-card
        class="animate-fade-in-up stagger-3 block"
        label="Kepatuhan Iuran"
        [value]="collectionRate() + '%'"
        icon="verified"
        subtext="bulan berjalan"
        infoTooltip="Persentase anggota aktif yang telah melunasi iuran wajib kas pada periode bulan berjalan."
        trend="up"
        trendValue="+5%"
        tone="amber"
      />
      <app-stat-card
        class="animate-fade-in-up stagger-4 block"
        label="Diskusi Aktif"
        [value]="totalTopics().toString()"
        icon="forum"
        subtext="topik internal"
        infoTooltip="Jumlah topik musyawarah dan diskusi terbuka yang sedang aktif dibahas oleh warga."
        tone="slate"
      />
    </div>
  `
})
export class DashboardKpisComponent {
  totalMembers = input.required<number>();
  formattedBalance = input.required<string>();
  collectionRate = input.required<number>();
  totalTopics = input.required<number>();
}
