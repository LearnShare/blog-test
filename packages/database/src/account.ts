import {
  Prisma,
} from '@prisma/client';

import prisma from './prisma';
import Hash from '@packages/lib/hash';

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

const PublicFields = {
  id: true,
  email: true,
  name: true,
  ctime: true,
};

// create account
async function createAccount(email: string, password: string) {
  const account = await prisma.account.create({
    data: {
      email,
      name: email.replace('@', '#'),
      password: await Hash.hashPassword(password),
    },
    select: PublicFields,
  });

  return account;
}

// get account info by email
async function getAccountByEmail(email: string) {
  const account = await prisma.account.findUnique({
    where: {
      email,
    },
  });

  return account;
}

// get account info by id
async function getAccountById(id: string) {
  const account = await prisma.account.findUnique({
    where: {
      id,
    },
  });

  return account;
}

// get accounts
async function getAccounts(search?: string, page?: number, size?: number) {
  const accounts = await prisma.account.findMany({
    // where: {
    //   OR: [
    //     {
    //       email: {
    //         contains: search,
    //       },
    //     },
    //     {
    //       name: {
    //         contains: search,
    //       },
    //     },
    //   ],
    // },
    select: PublicFields,
    skip: 0,
    take: DB_SIZE,
  });

  return accounts;
}

export default {
  createAccount,
  getAccountByEmail,
  getAccountById,
  getAccounts,
};
