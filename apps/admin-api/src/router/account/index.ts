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
import Hash from '@packages/lib/hash';
import Auth from '@/lib/auth';
import {
  getAccountInfo,
  updateAccount,
} from '@/lib/account';

const accountRouter = Router();

/**
 * get accounts
 * query:
 * - search: email/name
 * - role
 * - disabled: 1|0
 * - posts: 1|0
 * - sort: [-]ctime
 */
accountRouter.get(
  '/',
  async (req: Request, res: Response) => {
    const {
      search,
      role,
      disabled,
      sort,
      page,
      size,
    } = req.query;

    const {
      data,
    } = await DB.account.getAccounts({
      search: search as string,
      role: role as string,
      posts: true,
      sort: (sort as string)
          || DB_SORT,
      disabled: disabled
          ? !!Number(disabled)
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

/**
 * update account info by id
 */
accountRouter.put(
  '/:id',
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.params;
    const {
      disabled,
    } = req.body;

    updateAccount(Number(id), {
      disabled,
    }, res);
  },
);

export default accountRouter;
