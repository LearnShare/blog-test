import {
  Router,
  Request,
  Response,
} from 'express';

import BlogError from '@packages/lib/error';
import Validator from '@packages/lib/validator';
import Hash from '@packages/lib/hash';
import JWT from '@packages/lib/jwt';
import DB from '@packages/database';
import Redis from '@/lib/redis';
import {
  getAccountInfo,
} from '@/lib/account';
import Auth, {
  type CustomRequest,
} from '@/lib/auth';

const authRouter = Router();

/**
 * sign-in
 * body:
 * - email
 * - password
 */
authRouter.post('/sign-in', async (req: Request, res: Response) => {
  const {
    email,
    password,
  } = req.body;

  // 1. validate email
  const emailResult = Validator.validateEmail(email);
  if (!emailResult.success) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid email',
        });
    return;
  }

  // 2. check is account exist
  const {
    data: account,
  } = await DB.account.getAccountByEmail(email);

  // 3. check password
  let passwordMatch = false;
  if (account) {
    passwordMatch = await Hash.checkPassword(password, account.password);
  }

  if (!account
      || !passwordMatch) {
    throw new BlogError({
      status: 400,
      message: 'Account or Password error',
    });
  }

  // 4. check role
  if (account.role !== 'ADMIN') {
    throw new BlogError({
      status: 403,
      message: 'Not allowed',
    });
  }

  // 5. JWT token
  const {
    id,
  } = account;

  const {
    password: accountPassword,
    ...rest
  } = account;

  await Redis.setAccountInfo(id, rest);

  const token = await JWT.encrypt({
    id,
  });

  res.json({
    token,
    data: rest,
  });
});

/**
 * get current account info
 */
authRouter.get('/info', Auth.check, async (req: CustomRequest, res: Response) => {
  const {
    id,
  } = req.user;

  getAccountInfo(id, res);
});

export default authRouter;
