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

export async function updateAccount(id: number, data: Record<string, any>, res: Response) {
  if (data
      && data.uid) {
    // 1. validate uid
    const result = Validator.validateUid(data.uid);
    if (!result.success) {
      throw new BlogError({
        status: 400,
        message: 'Invalid uid',
      });
    }

    // 2. check is uid exists
    const {
      data: account,
    } = await DB.account.getAccountByUid(data.uid);

    if (account
        && account.id !== id) {
      throw new BlogError({
        status: 400,
        message: 'ID exists',
      });
    }
  }

  // 3. update account
  const {
    data: account,
  } = await DB.account.updateAccount(id, data);

  res.json(account);
}
