import HTTP from '../../http';

export interface PostsQuery {
  search?: string;
  author?: number;
  account?: number;
  sort?: string;
  page?: number;
  size?: number;
}

function getPosts(query: PostsQuery) {
  return HTTP.get('/post', {
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
