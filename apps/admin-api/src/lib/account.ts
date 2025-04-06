import {
  Response,
} from 'express';

import BlogError from '@packages/lib/error';
import Validator from '@packages/lib/validator';
import Hash from '@packages/lib/hash';
import DB from '@packages/database';

export async function getAccountInfo(id: number, res: Response) {
  // 1. check id
  if (!id) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid user id',
        });
    return;
  }

  const {
    data: account,
  } = await DB.account.getAccountById(id);

  // 2. check is account exist
  if (!account) {
    throw new BlogError({
      status: 404,
      message: 'Account not found',
    });
  }

  const {
    password,
    ...rest
  } = account;

  res.json(rest);
}
