import {
  Prisma,
} from '@prisma/client';
import prisma from './prisma';

import type {
  ListQuery,
} from './types';
import {
  DB_PAGE,
  DB_SIZE,
  DB_ORDER_BY,
} from './config';
import {
  searchInMultipleCol,
} from './utils';

// get account info
async function getAccountInfo(email: string) {
  const account = await prisma.account.findUnique({
    where: {
      email,
    },
  });

  return account;
}

export default {
  getAccountInfo,
};
