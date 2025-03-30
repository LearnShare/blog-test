export * from '../client';

export type AccountRole = 'ADMIN'
    | 'AUTHOR'
    | 'USER';

export type PostContentFormat = 'TEXT'
    | 'MARKDOWN';

export interface PostData {
  id?: number;
  title?: string;
  intro?: string;
  uid?: string;
  cover?: number;
  coverUrl?: string;
  content?: PostContentFormat;
  format?: string;
  published?: boolean;
}

export interface PostCreateData {
  title: string;
  intro: string;
  uid: string;
  cover: number;
  coverUrl: string;
  content: PostContentFormat;
  format: string;
  published: boolean;
}

export interface PostsQuery {
  search?: string;
  author?: number;      // account.id: 根据作者筛选
  account?: boolean;    // 是否包含作者信息
  bookmarkBy?: number;  // account.id: 根据用户 ID 判断是否已被收藏
  published?: boolean;
  sort: string;
  page: number;
  size: number;
}
