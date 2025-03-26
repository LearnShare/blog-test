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
      error,
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

    if (error) {
      res.status(500)
        .json({
          status: 500,
          message: error,
        });
      return;
    }

    res.json(data);
  },
);

export default authorRouter;
