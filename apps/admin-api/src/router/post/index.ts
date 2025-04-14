import {
  Router,
  Request,
  Response,
} from 'express';

import DB, {
  DB_PAGE,
  DB_SIZE,
  DB_SORT,
} from '@packages/database';
import Auth, {
  type CustomRequest,
} from '@/lib/auth';
import Hash from '@packages/lib/hash';
import type {
  PostStatus,
} from '@packages/types';

const postRouter = Router();

/**
 * get posts
 * query:
 * - search: title/content
 * - author: account.id
 * - status
 * - sort: [-]ctime
 * - page
 * - size
 */
postRouter.get('/', async (req: CustomRequest, res: Response) => {
  const {
    search,
    author,
    account,
    status,
    sort,
    page,
    size,
  } = req.query;

  const {
    data,
  } = await DB.post.getPosts({
    search: search as string,
    author: author
        ? Number(author)
        : null,
    account: true,
    status: status as PostStatus,
    content: true,
    sort: (sort as string)
        || DB_SORT,
    page: page
        ? Number(page)
        : DB_PAGE,
    size: size
        ? Number(size)
        : DB_SIZE,
  });

  res.json(data);
});

export default postRouter;
