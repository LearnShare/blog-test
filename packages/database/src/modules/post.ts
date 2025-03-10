import prisma from '../prisma';
import Account, {
  AccountPublicFields,
} from './account';

export interface PostData {
  title: string;
  content: string;
  published: boolean;
}

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

export interface PostsQuery {
  search?: string;
  author?: number;
  account?: boolean;
  published?: boolean;
  sort?: string;
  page?: number;
  size?: number;
}

// get posts
async function getPosts(postQuery: PostsQuery) {
  const {
    search,
    author,
    account,
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

    const data = {
      count,
      page,
      size,
      list,
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
    console.log(total, published, unpublished);

    return {
      data: {
        total,
        published,
        unpublished,
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
  updatePost,
  getStats,
};
