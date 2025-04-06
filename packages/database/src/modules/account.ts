import {
  AccountRole,
} from '../types';

import prisma from '../prisma';
import Hash from '@packages/lib/hash';

export const AccountPublicFields = {
  id: true,
  email: true,
  name: true,
  uid: true,
  avatar: true,
  avatarUrl: true,
  verified: true,
  role: true,
  intro: true,
  ctime: true,
  utime: true,
};

interface AccountData {
  email: string;
  password: string;
  role?: AccountRole;
  verified?: boolean;
}

// create account
async function createAccount({
  email,
  password,
  role = 'AUTHOR',
  verified = false,
}: AccountData) {
  const account = await prisma.account.create({
    data: {
      email,
      name: email.substring(0, email.indexOf('@')),
      password,
      uid: Hash.nanoid(),
      role,
      verified,
      utime: new Date(),
    },
    select: AccountPublicFields,
  });

  return {
    data: account,
  };
}

// get account info by email
async function getAccountByEmail(email: string) {
  const account = await prisma.account.findUnique({
    where: {
      email,
    },
    // select: AccountPublicFields,
  });

  return {
    data: account,
  };
}

// get account info by id
async function getAccountById(id: number) {
  const account = await prisma.account.findUnique({
    where: {
      id,
    },
    // select: AccountPublicFields,
  });

  return {
    data: account,
  };
}

// get account info by uid
async function getAccountByUid(uid: string) {
  const account = await prisma.account.findUnique({
    where: {
      uid,
    },
    select: AccountPublicFields,
  });

  return {
    data: account,
  };
}

// get accounts by ids
async function getAccountsByIds(ids: number[]) {
  const accounts = await prisma.account.findMany({
    where: {
      OR: ids.map((id) => ({
        id,
      })),
    },
    select: AccountPublicFields,
  });

  return {
    data: accounts,
  };
}

export interface AccountsQuery {
  search?: string;
  role?: AccountRole;
  posts?: boolean;
  sort: string;
  page: number;
  size: number;
}

// get accounts
async function getAccounts(accountQuery: AccountsQuery) {
  const {
    search,
    role,
    posts,
    sort,
    page,
    size,
  } = accountQuery;
  // order by
  const name = sort.startsWith('-')
      ? sort.substring(1)
      : sort;
  const direction = sort.startsWith('-')
      ? 'desc'
      : 'asc';

  const searchQuery = search
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
          {
            uid: {
              contains: search,
            },
          },
        ],
      }
      : {};
  const roleQuery = role
      ? {
        role,
      }
      : {};
  const countQuery = posts
      ? {
        _count: {
          select: {
            posts: true,
          },
        },
      }
      : {};

  const query = {
    ...searchQuery,
    ...roleQuery,
  };

  const count = await prisma.account.count({
    where: query,
  });

  const list = await prisma.account.findMany({
    where: query,
    orderBy: {
      [name]: direction,
    },
    include: countQuery,
    omit: {
      password: true,
    },
    skip: (page - 1) * size,
    take: size,
  });

  return {
    data: {
      count,
      page,
      size,
      list: posts
          ? list.map((item) => {
            const {
              _count,
              ...rest
            } = item;

            return {
              ...rest,
              postsCount: _count?.posts
                  || 0,
            };
          })
          : list,
    },
  };
}

export interface AuthorsQuery {
  posts: boolean;
  page: number;
  size: number;
}

// get authors
async function getAuthors(authorsQuery: AuthorsQuery) {
  const {
    posts,
    page,
    size,
  } = authorsQuery;

  const query = {
    role: 'AUTHOR',
  };

    const count = await prisma.account.count({
      where: query,
    });

    const list = await prisma.account.findMany({
      where: query,
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      select: {
        ...AccountPublicFields,
        _count: { // count public post
          select: {
            posts: {
              where: {
                status: 'public',
              },
            },
          },
        },
      },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data: {
        count,
        page,
        size,
        list: list.map((item) => {
          const {
            _count,
            ...rest
          } = item;

          return {
            ...rest,
            postsCount: _count?.posts
                || 0,
          };
        }),
      },
    };
}

// update account
async function updateAccount(id: number, data: Record<string, any>) {
  const account = await prisma.account.update({
    where: {
      id,
    },
    data: {
      ...data,
      utime: new Date(),
    },
    select: AccountPublicFields,
  });

  return {
    data: account,
  };
}

export default {
  createAccount,
  getAccountByEmail,
  getAccountById,
  getAccountByUid,
  getAccounts,
  getAccountsByIds,
  updateAccount,

  getAuthors,
};
