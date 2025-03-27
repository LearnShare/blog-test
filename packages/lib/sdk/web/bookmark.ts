import HTTP from '../../http';

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
  save,
  remove,
  check,
};
