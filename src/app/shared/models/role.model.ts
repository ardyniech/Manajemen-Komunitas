export type AppPermission =
  | 'manage_members'
  | 'view_members'
  | 'manage_finance'
  | 'view_finance'
  | 'post_forum'
  | 'moderate_forum'
  | 'export_reports'
  | 'manage_roles'
  | 'manage_settings'
  | 'trigger_backup';

export interface UserRole {
  id: string;
  code: 'super_admin' | 'ketua' | 'bendahara' | 'moderator' | 'anggota';
  name: string;
  description: string;
  color: string;
  permissions: AppPermission[];
  isSystemDefault: boolean;
  memberCount: number;
}
