import HTTP from '../http';

import {
  PostData,
} from '@packages/database';

function create(data: PostData) {
  return HTTP.post('/post', data);
}

function get(uid: string) {
  return HTTP.get(`/post/uid/${uid}`);
}

export interface PostsQuery {
  search?: string;
  author?: number;
  account?: number;
  status?: string;
  sort?: string;
  page?: number;
  size?: number;
}

function getPosts(query: PostsQuery) {
  return HTTP.get('/post', {
    params: query,
  });
}

function update(id: number, data: PostData) {
  return HTTP.put(`/post/${id}`, data);
}

function updatePublished(id: number, data: {
  published: boolean;
}) {
  return HTTP.put(`/post/${id}/published`, data);
}

function del(id: number) {
  return HTTP.delete(`/post/${id}`);
}

export default {
  create,
  get,
  getPosts,
  update,
  updatePublished,
  del,
};
