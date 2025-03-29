import {
  ContentFormat,
} from '../client';

export * from '../client';

export interface OrderBy {
  [key: string]: 'asc' | 'desc';
}

export interface ListQuery {
  page?: number;
  size?: number;
  orderBy?: OrderBy;
  search?: string;
  // [key: string]: any;
}

export interface PostData {
  id?: number;
  title?: string;
  intro?: string;
  uid?: string;
  cover?: number;
  coverUrl?: string;
  content?: string;
  format?: ContentFormat;
  published?: boolean;
}

export interface PostCreateData {
  title: string;
  intro: string;
  uid: string;
  cover: number;
  coverUrl: string;
  content: string;
  format: ContentFormat;
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
