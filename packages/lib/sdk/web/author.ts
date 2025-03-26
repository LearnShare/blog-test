import HTTP from '../../http';

interface AuthorsQuery {
 posts?: number;
 page?: number;
 size?: number;
}

function getAuthors(query: AuthorsQuery) {
  return HTTP.get('/author', {
    params: query,
  });
}

function getAuthor(uid: string) {
  return HTTP.get(`/author/${uid}`);
}

export default {
  getAuthors,
  getAuthor,
};
