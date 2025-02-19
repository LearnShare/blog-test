import {
  Prisma,
} from '@prisma/client';

import prisma from './prisma';
import {
  AccountPublicFields,
} from './account';

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
  published?: boolean;
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
    });

    const ids = {};
    for (const item of list) {
      if (!ids[item.authorId]) {
        ids[item.authorId] = true;
      }
    }
    console.log(Object.keys(ids));
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

export default {
  createPost,
  getPosts,
  getPostById,
  updatePost,
};
