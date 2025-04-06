import {
  Account,
} from './account';

export interface Post {
  id: number;
  uid: string;
  cover?: number;
  coverUrl?: string;
  title: string;
  intro?: string;
  content: string;
  format?: string;
  authorId: number;
  author: Account;
  status: string;
  views: number;
  bookmarks: number;
  bookmarked?: boolean;
  utime: string;
}
