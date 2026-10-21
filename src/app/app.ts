import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './core/navigation/sidebar.component';
import { HeaderComponent } from './core/navigation/header.component';
import { NotificationDrawerComponent } from './core/navigation/notification-drawer.component';
import { currentPage, navigateTo, PageId } from './core/navigation/navigation.service';
import { isAuthenticated } from './core/auth/auth.service';
import { LandingAuthComponent } from './modules/landing-auth/landing-auth.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { CalendarPageComponent } from './modules/calendar/calendar-page.component';
import { GamificationPageComponent } from './modules/gamification/gamification-page.component';
import { LeaderboardPageComponent } from './modules/gamification/leaderboard-page.component';
import { TalentPlacementPageComponent } from './modules/talent-placement/talent-placement-page.component';
import { MembersComponent } from './modules/members/members.component';
import { MemberRegisterPageComponent } from './modules/members/member-register-page.component';
import { MemberKtaPageComponent } from './modules/members/member-kta-page.component';
import { MemberImportPageComponent } from './modules/members/member-import-page.component';
import { FinanceComponent } from './modules/finance/finance.component';
import { FinanceEntryPageComponent } from './modules/finance/finance-entry-page.component';
import { FinanceReceiptsPageComponent } from './modules/finance/finance-receipts-page.component';
import { FinanceQrisPageComponent } from './modules/finance/finance-qris-page.component';
import { FinanceReportsPageComponent } from './modules/finance/finance-reports-page.component';
import { MemberDuesRecapPageComponent } from './modules/finance/member-dues-recap-page.component';
import { ForumComponent } from './modules/forum/forum.component';
import { ForumNewPageComponent } from './modules/forum/forum-new-page.component';
import { ForumThreadPageComponent } from './modules/forum/forum-thread-page.component';
import { AnalyticsComponent } from './modules/analytics/analytics.component';
import { RolesComponent } from './modules/roles/roles.component';
import { CommunitySettingsComponent } from './modules/community-settings/community-settings.component';
import { Security2faComponent } from './modules/security-2fa/security-2fa.component';
import { IntegrationsComponent } from './modules/integrations/integrations.component';
import { ApiSandboxComponent } from './modules/integrations/api-sandbox.component';
import { ApiDocsPageComponent } from './modules/integrations/api-docs-page.component';
import { CloudBackupPageComponent } from './modules/integrations/cloud-backup-page.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatIconModule, SidebarComponent, HeaderComponent, NotificationDrawerComponent, LandingAuthComponent,
    DashboardComponent, ProfileComponent, CalendarPageComponent, GamificationPageComponent, LeaderboardPageComponent,
    TalentPlacementPageComponent, MembersComponent, MemberRegisterPageComponent,
    MemberKtaPageComponent, MemberImportPageComponent, FinanceComponent, FinanceEntryPageComponent,
    FinanceReceiptsPageComponent, FinanceQrisPageComponent, FinanceReportsPageComponent,
    MemberDuesRecapPageComponent,
    ForumComponent, ForumNewPageComponent, ForumThreadPageComponent, AnalyticsComponent,
    RolesComponent, CommunitySettingsComponent, Security2faComponent, IntegrationsComponent,
    ApiSandboxComponent, ApiDocsPageComponent, CloudBackupPageComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isAuth = isAuthenticated;
  activePage = currentPage;
  isMobileNavOpen = signal<boolean>(false);
  isNotificationOpen = signal<boolean>(false);

  pageTitle = computed(() => {
    switch (this.activePage()) {
      case 'profile': return 'Profil Pengguna & Paspor KTA';
      case 'events': return 'Kalender & Agenda Kegiatan Komunitas';
      case 'gamification': return 'Pusat Misi & Poin XP Komunitas';
      case 'leaderboard': return 'Papan Peringkat Kontributor Komunitas';
      case 'talent-placement': return 'Asesmen Karakter, Weton & Dewan Etik';
      case 'members': return 'Direktori & Manajemen Anggota';
      case 'member-register': return 'Formulir Pendaftaran Anggota Baru';
      case 'member-kta': return 'Studio KTA & Paspor Digital';
      case 'member-import': return 'Impor Masal Data Anggota (CSV)';
      case 'finance': return 'Buku Kas & Pembayaran Iuran';
      case 'finance-entry': return 'Catat Transaksi Keuangan Baru';
      case 'finance-receipts': return 'Kuitansi Digital & Tanda Terima';
      case 'finance-qris': return 'Pembayaran Iuran QRIS Dinamis';
      case 'finance-reports': return 'Rekapitulasi & Laporan Keuangan';
      case 'member-dues-recap': return 'Rekapitulasi Kas & Iuran WhatsApp';
      case 'forum': return 'Forum Diskusi Komunitas';
      case 'forum-new': return 'Buat Topik Diskusi Baru';
      case 'forum-thread': return 'Percakapan & Balasan Komunitas';
      case 'analytics': return 'Dasbor Analitik & Perkembangan';
      case 'roles': return 'Kelola Hak Akses & Administrator';
      case 'settings': return 'Profil & Pengaturan Komunitas';
      case 'security': return 'Otentikasi 2FA & Keamanan E2EE';
      case 'integrations': return 'Integrasi API & Cloud Ecosystem';
      case 'api-sandbox': return 'REST API Interactive Sandbox';
      case 'api-docs': return 'Dokumentasi REST API & Webhook';
      case 'cloud-backup': return 'Pencadangan Cloud & Snapshot';
      default: return 'Ringkasan Aktivitas Komunitas';
    }
  });

  switchTab(page: string): void {
    navigateTo(page as PageId);
    this.isMobileNavOpen.set(false);
  }

  closeMobileNavBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.isMobileNavOpen.set(false);
    }
  }
}
