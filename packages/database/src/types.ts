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
  title: string;
  intro?: string;
  uid?: string;
  cover?: number;
  coverUrl?: string;
  content: string;
  format?: string;
  published?: boolean;
}

export interface PostsQuery {
  search?: string;
  author?: number;
  account?: boolean;
  published?: boolean;
  sort?: string;
  page?: number;
  size?: number;
}
