import HTTP from '../../http';

export interface PostsQuery {
  search?: string;
  author?: string;
  account?: number;
  sort?: string;
  page?: number;
  size?: number;
}

function getPosts(query: PostsQuery) {
  return HTTP.get<any, any>('/post', {
    params: query,
  });
}

function del(id: number) {
  return HTTP.delete(`/post/${id}`);
}

export default {
  getPosts,
  del,
};
