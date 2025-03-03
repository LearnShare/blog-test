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
    email,
    name,
    ctime,
    utime,
  } = account;

  res.json({
    id,
    email,
    name,
    ctime,
    utime,
  });
}

export async function updateAccount(id: number, data: Record<string, any>, res: Response) {
  const {
    data: account,
    error,
  } = await DB.account.updateAccount(id, data);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  res.json(account);
}

export async function updatePassword(id: number, oldPassword: string, password: string, res: Response) {
  // 1. check account and old password
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

  if (!account) {
    res.status(404)
        .json({
          status: 404,
          message: 'Account not found',
        });
    return;
  }

  const match = await Hash.checkPassword(oldPassword, account.password);

  if (!match) {
    res.status(400)
        .json({
          status: 400,
          message: 'Old Password error',
        });
    return;
  }

  // 2. validate password
  const passwordResult = Validator.validatePassword(password);
  if (!passwordResult.success) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid new password',
        });
    return;
  }

  // 3. update password
  const hash = await Hash.hashPassword(password);

  updateAccount(id, {
    password: hash,
  }, res);
}
