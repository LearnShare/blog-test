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
    res.status(401)
        .json({
          code: 401,
          message: 'Invalid authorization token',
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

  const account = await Redis.getAccountInfo(id);

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

function checkRole(roles: string[]) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const {
      id,
    } = req.user;

    const account = await Redis.getAccountInfo(id);

    if (!roles.includes(account.role)) {
      res.status(403)
          .json({
            code: 403,
            message: 'Action not allowed',
          });
      return;
    }

    next();
  };
}

async function checkFileLimits(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    id,
  } = req.user;

  const {
    data,
    error,
  } = await DB.file.getStats(id);

  const {
    total,
    totalSize,
  } = data;

  const totalLimit = Number(process.env.UPLOAD_TOTAL);
  const totalSizeLimit = Number(process.env.UPLOAD_TOTAL_SIZE);

  if (total >= totalLimit
      || totalSize >= totalSizeLimit) {
    res.status(403)
        .json({
          code: 403,
          message: 'Upload limit exceeded',
        });
    return;
  }

  next();
}

export default {
  check,
  checkVerified,
  checkRole,
  checkFileLimits,
};
