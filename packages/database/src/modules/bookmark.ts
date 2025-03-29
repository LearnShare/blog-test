import type { Account } from '../../client';
import prisma from '../prisma';
import account from './account';

export interface BookmarksQuery {
  account?: number;
  sort: string;
  page: number;
  size: number;
}

// get bookmarks
async function getBookmarks(bookmarkQuery: BookmarksQuery) {
  const {
    account: accountId,
    sort,
    page,
    size,
  } = bookmarkQuery;

  // order by
  const name = sort.startsWith('-')
    ? sort.substring(1)
    : sort;
  const direction = sort.startsWith('-')
    ? 'desc'
    : 'asc';

  const query = accountId
      ? {
        account: {
          id: accountId,
        },
      }
      : {};

  try {
    const count = await prisma.bookmark.count({
      where: query,
    });

    const list = await prisma.bookmark.findMany({
      where: query,
      orderBy: {
        [name]: direction,
      },
      skip: (page - 1) * size,
      take: size,
      include: {
        post: {
          include: {
            _count: {
              select: {
                bookmarks: true,
              },
            },
          },
        },
      },
    });

    const data: Record<string, any> = {
      count,
      page,
      size,
      list: list.map((item) => {
        const {
          post,
          ...rest
        } = item;

        const {
          _count,
          ...postData
        } = post;

        return {
          ...rest,
          post: {
            ...postData,
            bookmarks: _count?.bookmarks
                || 0,
            bookmarked: true,
          },
        };
      }),
    };

    // author data
    const ids: Record<number, boolean> = {};
    for (const item of list) {
      if (!ids[item.post.authorId]) {
        ids[item.post.authorId] = true;
      }
    }

    const accountsData = await account.getAccountsByIds(
      Object.keys(ids)
          .map((id) => Number(id))
    );
    const accounts: Record<number, Account> = {};
    if (accountsData
        && accountsData.data) {
      for (const item of accountsData.data) {
        if (!accounts[item.id]) {
          accounts[item.id] = item as Account;
        }
      }
    }

    data.accounts = accounts;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// create bookmark
async function createBookmark(accountId: number, postId: number) {
  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        account: {
          connect: {
            id: accountId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });

    return {
      data: bookmark,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// search bookmark by account.id and post.id
async function searchBookmark(accountId: number, postId?: number) {
  try {
    const postQuery = postId
        ? {
          post: {
            id: postId,
          },
        }
        : {};

    const query = {
      account: {
        id: accountId,
      },
      ...postQuery
    };

    const count = await prisma.bookmark.count({
      where: query,
    });
    const list = await prisma.bookmark.findMany({
      where: query,
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

// delete bookmark by account.id and post.id
async function deleteBookmark(accountId: number, postId: number) {
  try {
    await prisma.bookmark.delete({
      where: {
        accountId_postId: {
          accountId,
          postId,
        },
      },
    });

    return {};
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

export default {
  getBookmarks,
  createBookmark,
  searchBookmark,
  deleteBookmark,
};
