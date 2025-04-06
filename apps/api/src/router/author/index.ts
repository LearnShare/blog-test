import {
  Router,
  Request,
  Response,
} from 'express';

import BlogError from '@packages/lib/error';
import DB, {
  DB_PAGE,
  DB_SIZE,
  DB_SORT,
} from '@packages/database';
import {
  getAccountInfo,
  updateAccount,
  updatePassword,
} from '@/lib/account';

const authorRouter = Router();

/**
 * get authors
 * query:
 * - posts: 1|0
 * - sort: [-]ctime
 */
authorRouter.get(
  '/',
  async (req: Request, res: Response) => {
    const {
      posts,
      page,
      size,
    } = req.query;

    const {
      data,
    } = await DB.account.getAuthors({
      posts: posts
          ? Boolean(Number(posts))
          : null,
      page: page
          ? Number(page)
          : DB_PAGE,
      size: size
          ? Number(size)
          : DB_SIZE,
    });

    res.json(data);
  },
);

/**
 * get author info by uid
 */
authorRouter.get(
  '/:uid',
  async (req: Request, res: Response) => {
    const {
      uid,
    } = req.params;

    // 1. account info
    const {
      data: account,
    } = await DB.account.getAccountByUid(uid);

    // 2. check is account exist
    if (!account) {
      throw new BlogError({
        status: 404,
        message: 'Account not found',
      });
    }

    // 3. post stats
    const {
      data: postStats,
    } = await DB.post.getStats(account.id);

    res.json({
      ...account,
      postStats,
    });
  },
);

export default authorRouter;
