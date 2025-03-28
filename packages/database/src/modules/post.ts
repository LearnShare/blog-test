import prisma from '../prisma';
import Account, {
  AccountPublicFields,
} from './account';
import Bookmark from './bookmark';

import {
  PostData,
  PostsQuery,
} from '../types';

// create post
async function createPost(accountId: number, postData: PostData) {
  try {
    const post = await prisma.post.create({
      data: {
        ...postData,
        author: {
          connect: {
            id: accountId,
          },
        },
      },
    });

    return {
      data: post,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// get posts
async function getPosts(postQuery: PostsQuery) {
  const {
    search,
    author,
    account,
    bookmarkBy,
    published,
    sort,
    page,
    size,
  } = postQuery;

  // order by
  const name = sort.startsWith('-')
    ? sort.substring(1)
    : sort;
  const direction = sort.startsWith('-')
    ? 'desc'
    : 'asc';

  const authorQuery = author
      ? {
        id: author,
      }
      : {};
  const publishedQuery = published !== null
      ? {
        published,
      }
      : {};
  const searchQuery = search
      ? {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
        ],
      }
      : {};

  const query = {
    author: authorQuery,
    ...publishedQuery,
    ...searchQuery,
  };

  try {
    const count = await prisma.post.count({
      where: query,
    });

    const list = await prisma.post.findMany({
      where: query,
      orderBy: {
        [name]: direction,
      },
      skip: (page - 1) * size,
      take: size,
      include: {
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
      // no content in list
      // omit: {
      //   content: true,
      // },
    });

    const bookmarkedPosts = {};
    // include bookmark status
    if (bookmarkBy) {
      const {
        data: bookmarkData,
      } = await Bookmark.searchBookmark(bookmarkBy);

      for (const item of bookmarkData.list) {
        bookmarkedPosts[item.postId] = true;
      }
    }

    const data = {
      count,
      page,
      size,
      list: list.map((item) => {
        const {
          _count,
          content,
          ...rest
        } = item;

        return {
          ...rest,
          bookmarks: _count?.bookmarks
              || 0,
          bookmarked: bookmarkBy
              && bookmarkedPosts[item.id],
        };
      }),
    };

    // include accounts info
    if (account) {
      const ids = {};
      for (const item of list) {
        if (!ids[item.authorId]) {
          ids[item.authorId] = true;
        }
      }

      const accountsData = await Account.getAccountsByIds(
        Object.keys(ids)
            .map((id) => Number(id))
      );
      const accounts = {};
      for (const account of accountsData.data) {
        if (!accounts[account.id]) {
          accounts[account.id] = account;
        }
      }

      data.accounts = accounts;
    }

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

// get post by id
async function getPostById(id: number) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: AccountPublicFields,
        },
      },
    });

    return {
      data: post,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// get post by uid
async function getPostByUid(uid: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        uid,
      },
      include: {
        author: {
          select: AccountPublicFields,
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });

    const {
      _count,
      ...rest
    } = post;

    const data = {
      ...rest,
      bookmarks: _count?.bookmarks
          || 0,
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

// update post
async function updatePost(id: number, postData: PostData) {
  try {
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        ...postData,
        utime: new Date(),
      },
    });

    return {
      data: post,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// update post views
async function updatePostViews(id: number) {
  try {
    await prisma.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}

// delete post
async function deletePost(id: number, postData: PostData) {
  try {
    await prisma.post.delete({
      where: {
        id,
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

// get post stats
async function getStats(id?: number) {
  const authorQuery = id
      ? {
        author: {
          id,
        },
      }
      : {};

  try {
    const total = await prisma.post.count({
      where: {
        ...authorQuery,
      },
    });
    const published = await prisma.post.count({
      where: {
        ...authorQuery,
        published: true,
      },
    });
    const unpublished = await prisma.post.count({
      where: {
        ...authorQuery,
        published: false,
      },
    });

    const viewsSum = await prisma.post.aggregate({
      where: {
        ...authorQuery,
        published: true,
      },
      _sum: {
        views: true,
      },
    });
    const views = viewsSum._sum.views
        || 0;

    const bookmarksTotal = await prisma.bookmark.aggregate({
      where: {
        post: {
          authorId: id,
        },
      },
      _count: {
        _all: true,
      },
    });
    const bookmarks = bookmarksTotal._count._all
        || 0;

    return {
      data: {
        total,
        published,
        unpublished,
        views,
        bookmarks,
      },
    };
  } catch (error) {
    return {
      error,
    };
  }
}

export default {
  createPost,
  getPosts,
  getPostById,
  getPostByUid,
  updatePost,
  updatePostViews,
  deletePost,
  getStats,
};
