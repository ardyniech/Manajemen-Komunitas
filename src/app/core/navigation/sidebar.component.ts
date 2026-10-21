import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { settingsState } from '../../shared/utils/storage';
import { activeUserContext, hasAppPermission } from '../rbac.service';
import { NAV_TREE, NavTreeNode, PageId } from './navigation.service';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <aside class="w-full bg-white/95 backdrop-blur-md border-r border-slate-200/80 h-full flex flex-col p-3 shrink-0 select-none overflow-hidden">
      <!-- App Header & Mobile Close -->
      <div class="flex items-center justify-between px-1.5 py-1.5 mb-1.5">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <mat-icon class="text-base">account_tree</mat-icon>
          </div>
          <div class="min-w-0">
            <h1 class="text-xs font-bold text-slate-900 truncate">{{ settingsState().communityName }}</h1>
            <span class="text-[9px] font-semibold text-indigo-600 uppercase tracking-wider block">Tree Nav OS</span>
          </div>
        </div>
        <button type="button" (click)="closeNav.emit()" class="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Tutup Menu">
          <mat-icon class="text-lg">close</mat-icon>
        </button>
      </div>

      <!-- Quick Search -->
      <div class="px-1 mb-2">
        <div class="relative flex items-center">
          <mat-icon class="absolute left-2 text-sm text-slate-400">search</mat-icon>
          <input #sb [value]="query()" (input)="query.set(sb.value)" type="search" placeholder="Cari halaman..." class="w-full pl-7 pr-2 py-1 text-xs bg-slate-100 rounded-lg border border-transparent focus:border-indigo-300 focus:bg-white focus:outline-none placeholder:text-slate-400" />
        </div>
      </div>

      <!-- Nav Tree -->
      <nav class="flex-1 space-y-0.5 overflow-y-auto pr-0.5 overscroll-contain">
        @for (node of filteredNodes(); track node.id) {
          <div>
            <button type="button" (click)="handleNodeClick(node)" [class]="isNodeActive(node) ? 'bg-slate-900 text-white font-bold shadow-2xs' : 'text-slate-700 hover:bg-slate-100 font-medium'" class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all text-left">
              <div class="flex items-center gap-2 min-w-0">
                <mat-icon class="text-base shrink-0">{{ node.icon }}</mat-icon>
                <span class="truncate">{{ node.label }}</span>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                @if (node.badge) { <span class="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">{{ node.badge }}</span> }
                @if (node.children?.length) { <mat-icon class="text-sm transition-transform duration-200" [class.rotate-180]="isExpanded(node.id)">expand_more</mat-icon> }
              </div>
            </button>

            @if (node.children?.length && isExpanded(node.id)) {
              <div class="pl-3.5 pr-1 py-0.5 space-y-0.5 border-l-2 border-indigo-100 ml-3.5 my-0.5">
                @for (c of node.children; track c.pageId) {
                  <button type="button" (click)="selectPage(c.pageId)" [class]="activeTab() === c.pageId ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'" class="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] transition-all text-left">
                    <mat-icon class="text-sm opacity-80 shrink-0">{{ c.icon }}</mat-icon>
                    <span class="truncate">{{ c.label }}</span>
                  </button>
                }
              </div>
            }
          </div>
        }
      </nav>

      <!-- Footer -->
      <div class="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 mt-1 flex items-center justify-between">
        <span class="font-medium text-slate-700">1 Fitur 1 Halaman</span>
        <span class="font-bold text-indigo-600 font-mono">20+ Halaman</span>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  activeTab = input.required<string>();
  selectTab = output<string>();
  closeNav = output<void>();
  settingsState = settingsState;
  activeUser = activeUserContext;
  query = signal('');
  expanded = signal<Record<string, boolean>>({ 'grp-gamification': true, 'grp-members': true, 'grp-finance': true, 'grp-forum': true, 'grp-integrations': false });

  visibleNodes = computed(() => {
    const isMember = this.activeUser().roleCode === 'anggota';
    return NAV_TREE.filter(node => !node.adminOnly || (!isMember && hasAppPermission('manage_roles')));
  });

  filteredNodes = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.visibleNodes();
    return this.visibleNodes().filter(n => n.label.toLowerCase().includes(q) || n.children?.some(c => c.label.toLowerCase().includes(q) || c.pageId.toLowerCase().includes(q)));
  });

  isExpanded(id: string): boolean { return this.query().trim().length > 0 || !!this.expanded()[id]; }
  isNodeActive(node: NavTreeNode): boolean { return node.pageId === this.activeTab() || !!node.children?.some(c => c.pageId === this.activeTab()); }

  handleNodeClick(node: NavTreeNode): void {
    if (node.children?.length) {
      this.expanded.update(m => ({ ...m, [node.id]: !m[node.id] }));
      if (node.pageId) { this.selectTab.emit(node.pageId); this.closeNav.emit(); }
    } else if (node.pageId) {
      this.selectTab.emit(node.pageId);
      this.closeNav.emit();
    }
  }

  selectPage(pageId: PageId): void {
    this.selectTab.emit(pageId);
    this.closeNav.emit();
  }
}
