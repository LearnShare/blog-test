import {
  Prisma,
  type Account,
} from '../../client';

import prisma from '../prisma';
import accountModule, {
  AccountPublicFields,
} from './account';
import ticketModule from './ticket';
import Bookmark from './bookmark';

import {
  PostData,
  PostCreateData,
  PostsQuery,
} from '../types';

// create post
async function createPost(accountId: number, postData: PostCreateData) {
  const post = await prisma.post.create({
    data: {
      ...postData,
      utime: new Date(),
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
}

// get posts
async function getPosts(postQuery: PostsQuery) {
  const {
    search,
    author,
    account,
    bookmarkBy,
    status,
    content: withContent,
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
  const statusQuery = status
      ? {
        status,
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
            intro: {
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
    ...statusQuery,
    ...searchQuery,
  };

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
  });

  const bookmarkedPosts: Record<number, boolean> = {};
  // include bookmark status
  if (bookmarkBy) {
    const {
      data: bookmarkData,
    } = await Bookmark.searchBookmark(bookmarkBy);

    if (bookmarkData
        && bookmarkData.list) {
      for (const item of bookmarkData.list) {
        bookmarkedPosts[item.postId] = true;
      }
    }
  }

  const data: Record<string, any> = {
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
        content: withContent
            ? content
            : '',
        bookmarks: _count?.bookmarks
            || 0,
        bookmarked: bookmarkBy
            && bookmarkedPosts[item.id],
      };
    }),
  };

  // include accounts info
  if (account) {
    const ids: Record<number, boolean> = {};
    for (const item of list) {
      if (!ids[item.authorId]) {
        ids[item.authorId] = true;
      }
    }

    const accountsData = await accountModule.getAccountsByIds(
      Object.keys(ids)
          .map((id) => Number(id))
    );
    const accounts: Record<number, any> = {};
    if (accountsData
        && accountsData.data) {
      for (const account of accountsData.data) {
        if (!accounts[account.id]) {
          accounts[account.id] = account;
        }
      }
    }

    data.accounts = accounts;
  }

  // with tickets
  if (status === 'rejected') {
    const ids: Record<number, boolean> = {};
    for (const item of list) {
      if (item.ticket
          && !ids[item.ticket]) {
        ids[item.ticket] = true;
      }
    }

    const ticketsData = await ticketModule.getTicketsByIds(
      Object.keys(ids)
          .map((id) => Number(id))
    );
    const tickets: Record<number, any> = {};
    if (ticketsData
        && ticketsData.data) {
      for (const ticket of ticketsData.data) {
        if (!tickets[ticket.id]) {
          tickets[ticket.id] = ticket;
        }
      }
    }

    data.tickets = tickets;
  }

  return {
    data,
  };
}

// get post by id
async function getPostById(id: number) {
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
}

// get post by uid
async function getPostByUid(uid: string) {
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

  let data = null;
  if (post) {
    const {
      _count,
      ...rest
    } = post;

    data = {
      ...rest,
      bookmarks: _count?.bookmarks
          || 0,
    };
  }

  return {
    data,
  };
}

// update post
async function updatePost(id: number, postData: PostData) {
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
}

// update post views
async function updatePostViews(id: number) {
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

  return {};
}

// delete post
async function deletePost(id: number) {
  await prisma.post.delete({
    where: {
      id,
    },
  });

  return {};
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

  const total = await prisma.post.count({
    where: {
      ...authorQuery,
    },
  });
  const publics = await prisma.post.count({
    where: {
      ...authorQuery,
      status: 'public',
    },
  });
  const drafts = await prisma.post.count({
    where: {
      ...authorQuery,
      status: 'draft',
    },
  });
  const rejecteds = await prisma.post.count({
    where: {
      ...authorQuery,
      status: 'rejected',
    },
  });

  const viewsSum = await prisma.post.aggregate({
    where: {
      ...authorQuery,
      status: 'public',
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
      public: publics,
      draft: drafts,
      rejected: rejecteds,
      views,
      bookmarks,
    },
  };
}

// get posts by ids
async function getPostsByIds(ids: number[]) {
  const posts = await prisma.post.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return {
    data: posts,
  };
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
  getPostsByIds,
};
