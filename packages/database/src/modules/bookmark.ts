import prisma from '../prisma';

export interface BookmarksQuery {
  account?: number;
  sort?: string;
  page?: number;
  size?: number;
}

// get bookmarks
async function getBookmarks(bookmarkQuery: BookmarksQuery) {
  const {
    account,
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

  const query = account
      ? {
        account: {
          id: account,
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
        post: true,
      },
    });

    const data = {
      count,
      page,
      size,
      list,
    };

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
