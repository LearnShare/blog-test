import prisma from '../prisma';

export const AccountPublicFields = {
  id: true,
  email: true,
  name: true,
  avatar: true,
  verified: true,
  ctime: true,
  utime: true,
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
      select: AccountPublicFields,
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
      // select: AccountPublicFields,
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
async function getAccountById(id: number) {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
      // select: AccountPublicFields,
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

// get accounts by ids
async function getAccountsByIds(ids: number[]) {
  try {
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
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

export interface AccountsQuery {
  search?: string;
  posts?: boolean;
  sort?: string;
  page?: number;
  size?: number;
}

// get accounts
async function getAccounts(accountQuery: AccountsQuery) {
  const {
    search,
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
        ],
      }
      : {};
  const selectQuery = posts
        ? {
          ...AccountPublicFields,
          _count: {
            select: {
              posts: true,
            },
          },
        }
        : AccountPublicFields;

  try {
    const count = await prisma.account.count({
      where: searchQuery,
    });

    const list = await prisma.account.findMany({
      where: searchQuery,
      orderBy: {
        [name]: direction,
      },
      select: selectQuery,
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data: {
        count,
        page,
        size,
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
async function updateAccount(id: number, data: Record<string, any>) {
  try {
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
  getAccountsByIds,
  updateAccount,
};
