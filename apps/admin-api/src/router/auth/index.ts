import {
  Router,
  Request,
  Response,
} from 'express';

import Validator from '@packages/lib/validator';
import Hash from '@packages/lib/hash';
import JWT from '@packages/lib/jwt';
import DB from '@packages/database';
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
    error,
  } = await DB.account.getAccountByEmail(email);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  // 3. check password
  let passwordMatch = false;
  if (account) {
    passwordMatch = await Hash.checkPassword(password, account.password);
  }

  if (!account
      || !passwordMatch) {
    res.status(400)
        .json({
          status: 400,
          message: 'Account or Password error',
        });
    return;
  }

  if (!account
      || !passwordMatch) {
    res.status(400)
        .json({
          status: 400,
          message: 'Account or Password error',
        });
    return;
  }

  // 4. check role
  if (account.role !== 'ADMIN') {
    res.status(403)
        .json({
          status: 403,
          message: 'Not allowed',
        });
    return;
  }

  // 5. JWT token
  const {
    id,
  } = account;

  const {
    password: accountPassword,
    ...rest
  } = account;

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
