import {
  Request,
  Response,
  NextFunction,
} from 'express';

import BlogError from '@packages/lib/error';
import JWT from '@packages/lib/jwt';
import DB from '@packages/database';
import Redis from '@/lib/redis';

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
    const data = await JWT.decrypt(token) as {
      id: number;
    };

    const account = await Redis.getAccountInfo(data.id);

    if (account.role !== 'ADMIN') {
      throw new BlogError({
        status: 403,
        message: 'Account not allowed',
      });
    }

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

export default {
  auto,
  check,
};
