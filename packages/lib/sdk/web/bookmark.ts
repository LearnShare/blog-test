import HTTP from '../../http';

interface BookmarksQuery {
 page?: number;
 size?: number;
}

function getBookmarks(query: BookmarksQuery) {
  return HTTP.get('/bookmark', {
    params: {
      ...query,
      sort: '-time',
    },
  });
}

function save(postId: number) {
  return HTTP.post('/bookmark', {
    postId,
  });
}

function remove(postId: number) {
  return HTTP.delete(`/bookmark/${postId}`);
}

function check(postId: number) {
  return HTTP.get(`/bookmark/${postId}`);
}

export default {
  getBookmarks,
  save,
  remove,
  check,
};
