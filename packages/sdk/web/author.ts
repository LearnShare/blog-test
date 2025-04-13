import type {
  Account,
} from '@packages/database';
import HTTP from '../http';

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

function getAuthor(uid: string): Promise<Account> {
  return HTTP.get(`/author/${uid}`);
}

export default {
  getAuthors,
  getAuthor,
};
