import HTTP from '../../http';

import {
  PostData,
} from '@packages/database';

function create(data: PostData) {
  return HTTP.post('/post', data);
}

function get(uid: string) {
  return HTTP.get(`/post/uid/${uid}`);
}

interface PostsQuery {
  search?: string;
  account?: boolean;
  mine?: boolean;
  published?: boolean;
  sort?: string;
  page?: number;
  size?: number;
}

function getPosts(query: PostsQuery) {
  return HTTP.get('/post', {
    params: query,
  });
}

export default {
  create,
  get,
  getPosts,
};
