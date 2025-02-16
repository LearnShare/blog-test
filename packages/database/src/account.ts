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

const PublicFields = {
  id: true,
  email: true,
  name: true,
  ctime: true,
};

// create account
async function createAccount(email: string, password: string) {
  try {
    const account = await prisma.account.create({
      data: {
        email,
        name: email.replace('@', '#'),
        password,
      },
      select: PublicFields,
    });

    return {
      data: account,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// get account info by email
async function getAccountByEmail(email: string) {
  try {
    const account = await prisma.account.findUnique({
      where: {
        email,
      },
      // select: PublicFields,
    });

    return {
      data: account,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// get account info by id
async function getAccountById(id: string) {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
      // select: PublicFields,
    });

    return {
      data: account,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// get accounts
async function getAccounts(search?: string, sort = '-ctime', page = DB_PAGE, size = DB_SIZE) {
  // order by
  const name = sort.startsWith('-')
    ? sort.substring(1)
    : sort;
  const direction = sort.startsWith('-')
    ? 'desc'
    : 'asc';

  const query = search
      ? {
        OR: [
          {
            email: {
              contains: search,
            },
          },
          {
            name: {
              contains: search,
            },
          },
        ],
      }
      : {};

  try {
    const count = await prisma.account.count({
      where: query,
    });

    const list = await prisma.account.findMany({
      where: query,
      orderBy: {
        [name]: direction,
      },
      select: PublicFields,
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data: {
        count,
        list,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// update account
async function updateAccount(id: string, data: Record<string, any>) {
  try {
    const account = await prisma.account.update({
      where: {
        id,
      },
      data,
      select: PublicFields,
    });

    return {
      data: account,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

export default {
  createAccount,
  getAccountByEmail,
  getAccountById,
  getAccounts,
  updateAccount,
};
