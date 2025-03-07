import {
  Request,
  Response,
  NextFunction,
} from 'express';

import JWT from '@packages/lib/jwt';
import Redis from '@/lib/redis';
import DB from '@packages/database';

/**
 * check
 * 1. should login
 * 2. token valid
 */
async function check(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.get('Authorization');
  const token = authHeader
      && authHeader.split(' ')[1];

  if (!authHeader
      || !token) {
    res.status(401)
        .json({
          code: 401,
          message: 'You should login first',
        });
    return;
  }

  try {
    const data = await JWT.decrypt(token);

    req.user = data;

    next();
  } catch (error) {
    console.log(error);
    res.status(401)
        .json({
          code: 401,
          message: 'Invalid token',
        });
    return;
  }
}

async function checkVerified(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    id,
  } = req.user;

  let account = await Redis.getAccountInfo(id);
  if (!account) {
    const data = await DB.account.getAccountById(id);

    account = data.data;

    await Redis.setAccountInfo(id, account);
  }

  if (!account.verified) {
    res.status(403)
        .json({
          code: 403,
          message: 'Account not verified',
        });
    return;
  }

  next();
}

export default {
  check,
  checkVerified,
};
