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
