import {
  Response,
} from 'express';

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
    error,
  } = await DB.account.getAccountById(id);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  // 2. check is account exist
  if (!account) {
    res.status(404)
        .json({
          status: 404,
          message: 'Account not found',
        });
    return;
  }

  const {
    password,
    ...rest
  } = account;

  res.json(rest);
}
