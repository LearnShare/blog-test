import {
  Account,
} from './account';

export interface Post {
  id: number;
  cover?: string;
  title: string;
  content?: string;
  author?: Account;
  utime?: Date;
}
