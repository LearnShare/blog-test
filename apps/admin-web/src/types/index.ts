export interface Account {
  id: number;
  name: string;
  uid: string;
  email: string;
  verified: boolean;
  intro: string;
  avatarUrl: string;
  role: string;
  disabled: boolean;
  postsCount: number;
  ctime: string;
  utime: string;
}

export interface Post {
  id: number;
  uid: string;
  cover: number;
  coverUrl: string;
  title: string;
  intro: string;
  content: string;
  format: string;
  authorId: number;
  author: Account;
  published: boolean;
  ctime: string;
  utime: string;
}

export interface Ticket {
  id: number;
  type: string;
  ref: string;
  post?: Post;
  from?: number;
  to?: number;
  status: string;
  message?: string;
  ctime: string;
  utime: string;
}
