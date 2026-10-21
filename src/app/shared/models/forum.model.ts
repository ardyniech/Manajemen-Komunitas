export interface ForumComment {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface ForumTopic {
  id: string;
  category: 'Pengumuman' | 'Umum' | 'Keuangan & Proyek' | 'Ide & Inovasi';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  createdAt: string;
  isPinned: boolean;
  viewsCount: number;
  comments: ForumComment[];
  likesCount: number;
  tags: string[];
  isEncrypted?: boolean;
}
