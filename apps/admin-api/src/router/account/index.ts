import {
  Router,
  Request,
  Response,
} from 'express';

import DB, {
  DB_PAGE,
  DB_SIZE,
  DB_SORT,
  type AccountRole,
} from '@packages/database';
import Hash from '@packages/lib/hash';
import Auth from '@/lib/auth';
import {
  getAccountInfo,
} from '@/lib/account';

const accountRouter = Router();

/**
 * get accounts
 * query:
 * - search: email/name
 * - posts: 1|0
 * - sort: [-]ctime
 */
accountRouter.get(
  '/',
  async (req: Request, res: Response) => {
    const {
      search,
      role,
      sort,
      page,
      size,
    } = req.query;

    const {
      data,
      error,
    } = await DB.account.getAccounts({
      search: search as string,
      role: role as AccountRole,
      posts: true,
      sort: (sort as string)
          || DB_SORT,
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

/**
 * get account info by id
 */
accountRouter.get(
  '/:id',
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.params;

    getAccountInfo(Number(id), res);
  },
);

export default accountRouter;
