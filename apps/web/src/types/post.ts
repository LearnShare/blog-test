import {
  Account,
} from './account';

export interface Post {
  id: number;
  uid: string;
  cover?: string;
  title: string;
  intro?: string;
  content?: string;
  format?: string;
  author?: Account;
  published?: boolean;
  views?: number;
  bookmarks?: number;
  bookmarked?: boolean;
  utime?: Date;
}
