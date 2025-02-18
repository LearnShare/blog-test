import {
  Prisma,
} from '@prisma/client';

import prisma from './prisma';
import {
  AccountPublicFields,
} from './account';

import {
  DB_PAGE,
  DB_SIZE,
  DB_ORDER_BY,
} from './config';

export interface PostData {
  title: string;
  content: string;
  published: boolean;
}

// create post
async function createPost(accountId: string, postData: PostData) {
  try {
    const post = await prisma.post.create({
      data: {
        ...postData,
        author: {
          connect: {
            id: Number(accountId),
          },
        },
      },
      // return author info
      // include: {
      //   author: {
      //     select: AccountPublicFields,
      //   },
      // },
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

export interface PostsQuery {
  search?: string;
  author?: number;
  sort?: string;
  page?: number;
  size?: number;
}

// get posts
async function getPosts(postQuery: PostsQuery) {
  const {
    search,
    author,
    sort = '-ctime',
    page = DB_PAGE,
    size = DB_SIZE,
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
        id: Number(author),
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
    });

    // TODO return author data

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

export default {
  createPost,
  getPosts,
};
