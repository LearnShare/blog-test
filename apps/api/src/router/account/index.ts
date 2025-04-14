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
  updatePassword,
} from '@/lib/account';
import type {
  AccountRole,
} from '@packages/types';

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
  Auth.check,
  Auth.checkVerified,
  async (req: Request, res: Response) => {
    const {
      search,
      role,
      posts,
      sort,
      page,
      size,
    } = req.query;

    const {
      data,
    } = await DB.account.getAccounts({
      search: search as string,
      role: role as AccountRole,
      posts: posts
          ? Boolean(Number(posts))
          : null,
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
  },
);

/**
 * get account info by id
 */
accountRouter.get(
  '/:id',
  Auth.check,
  Auth.checkVerified,
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
  Auth.check,
  Auth.checkVerified,
  // premission: admin
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.params;
    const {
      name,
    } = req.body;

    updateAccount(Number(id), {
      name,
    }, res);
  },
);

/**
 * update password by id
 */
accountRouter.put(
  '/:id/password',
  Auth.check,
  Auth.checkVerified,
  // premission: admin
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.params;
    const {
      password,
    } = req.body;

    const hash = await Hash.hashPassword(password);

    updateAccount(Number(id), {
      password: hash,
    }, res);
  },
);

export default accountRouter;
