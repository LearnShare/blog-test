import {
  Response,
} from 'express';

import BlogError from '@packages/lib/error';
import Validator from '@packages/lib/validator';
import Hash from '@packages/lib/hash';
import DB from '@packages/database';
import Redis from '@/lib/redis';

export async function getAccountInfo(id: number, res: Response) {
  // 1. check id
  if (!id) {
    throw new BlogError({
      status: 400,
      message: 'Invalid user id',
    });
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

  await Redis.setAccountInfo(id, rest);

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

  await Redis.setAccountInfo(id, account);

  res.json(account);
}

export async function updatePassword(id: number, oldPassword: string, password: string, res: Response) {
  // 1. check account and old password
  const {
    data: account,
  } = await DB.account.getAccountById(id);

  if (!account) {
    throw new BlogError({
      status: 404,
      message: 'Account not found',
    });
  }

  const match = await Hash.checkPassword(oldPassword, account.password);

  if (!match) {
    throw new BlogError({
      status: 400,
      message: 'Old Password error',
    });
  }

  // 2. validate password
  const passwordResult = Validator.validatePassword(password);
  if (!passwordResult.success) {
    throw new BlogError({
      status: 400,
      message: 'Invalid new password',
    });
  }

  // 3. update password
  const hash = await Hash.hashPassword(password);

  updateAccount(id, {
    password: hash,
  }, res);
}
