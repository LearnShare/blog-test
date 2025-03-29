import {
  Account,
} from './account';
import {
  Post,
} from './post';

export interface Bookmark {
  accountId: number;
  account: Account;
  postId: number;
  post: Post;
}
