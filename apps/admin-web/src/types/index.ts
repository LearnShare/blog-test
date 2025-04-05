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
  title: string;
  intro: string;
  content: string;
  format: string;
  authorId: number;
  author: Account;
  ctime: string;
  utime: string;
}
