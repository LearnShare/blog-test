import {
  Request,
  Response,
  NextFunction,
} from 'express';

import BlogError from '@packages/lib/error';
import JWT from '@packages/lib/jwt';
import Redis from '@/lib/redis';
import DB from '@packages/database';

interface FileData {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface CustomRequest
    extends Request {
  user: any;
  file: FileData;
}

/**
 * auto
 * 1. check and dectypt token
 */
async function auto(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.get('Authorization');
  const token = authHeader
      && authHeader.split(' ')[1];

  if (token) {
    try {
      const data = await JWT.decrypt(token);

      req.user = data;

      next();
    } catch (error) {
      // ignore
      next();
    }
  } else{
    next();
  }
}

/**
 * check
 * 1. should login
 * 2. token valid
 */
async function check(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.get('Authorization');
  const token = authHeader
      && authHeader.split(' ')[1];

  if (!authHeader
      || !token) {
    throw new BlogError({
      status: 401,
      message: 'You should login first',
    });
  }

  try {
    const data = await JWT.decrypt(token);

    req.user = data;

    next();
  } catch (error) {
    throw new BlogError({
      status: 401,
      message: 'Invalid authorization token',
    });
  }
}

async function checkVerified(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const {
    id,
  } = req.user;

  const account = await Redis.getAccountInfo(id);

  if (!account.verified) {
    throw new BlogError({
      status: 403,
      message: 'Account not verified',
    });
  }

  next();
}

function checkRole(roles: string[]) {
  return async function (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const {
      id,
    } = req.user;

    const account = await Redis.getAccountInfo(id);

    if (!roles.includes(account.role)) {
      throw new BlogError({
        status: 403,
        message: 'Action not allowed',
      });
    }

    next();
  };
}

async function checkFileLimits(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const {
    id,
  } = req.user;

  const {
    data,
  } = await DB.file.getStats(id);

  const {
    total,
    totalSize,
  } = data;

  const totalLimit = Number(process.env.UPLOAD_TOTAL);
  const totalSizeLimit = Number(process.env.UPLOAD_TOTAL_SIZE);

  if (total >= totalLimit
      || totalSize >= totalSizeLimit) {
    throw new BlogError({
      status: 403,
      message: 'Upload limit exceeded',
    });
  }

  next();
}

export default {
  auto,
  check,
  checkVerified,
  checkRole,
  checkFileLimits,
};
