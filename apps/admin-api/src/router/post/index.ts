import {
  Router,
  Request,
  Response,
} from 'express';

import DB, {
  type PostContentFormat,
  DB_PAGE,
  DB_SIZE,
  DB_SORT,
} from '@packages/database';
import Auth, {
  type CustomRequest,
} from '@/lib/auth';
import Hash from '@packages/lib/hash';

const postRouter = Router();

/**
 * get posts
 * query:
 * - search: title/content
 * - author: account.id
 * - published: 1|0
 * - sort: [-]ctime
 * - page
 * - size
 */
postRouter.get('/', async (req: CustomRequest, res: Response) => {
  const {
    search,
    author,
    account,
    published,
    sort,
    page,
    size,
  } = req.query;

  const {
    data,
    error,
  } = await DB.post.getPosts({
    search: search as string,
    author: author
        ? Number(author)
        : null,
    account: true,
    published: published
        ? !!Number(published)
        : null,
    content: true,
    sort: (sort as string)
        || DB_SORT,
    page: page
        ? Number(page)
        : DB_PAGE,
    size: size
        ? Number(size)
        : DB_SIZE,
  });

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  res.json(data);
});

/**
 * get post by uid
 */
postRouter.get('/uid/:uid', async (req: Request, res: Response) => {
  const {
    uid,
  } = req.params;

  const {
    data: post,
    error,
  } = await DB.post.getPostByUid(uid);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  if (!post
      || !post.published) {
    res.status(404)
        .json({
          status: 404,
          message: 'Post not found',
        });
    return;
  }

  DB.post.updatePostViews(post.id);

  res.json(post);
});

/**
 * get post by id
 */
postRouter.get('/:id', async (req: Request, res: Response) => {
  const {
    id,
  } = req.params;

  const {
    data: post,
    error,
  } = await DB.post.getPostById(Number(id));

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  if (!post
      || !post.published) {
    res.status(404)
        .json({
          status: 404,
          message: 'Post not found',
        });
    return;
  }

  res.json(post);
});

/**
 * delete post by id
 */
postRouter.delete('/:id', async (req: Request, res: Response) => {
  const {
    id,
  } = req.params;

  const {
    data: post,
    error,
  } = await DB.post.getPostById(Number(id));

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  if (!post) {
    res.status(404)
        .json({
          status: 404,
          message: 'Post not found',
        });
    return;
  }

  const {
    error: deleteError,
  } = await DB.post.deletePost(Number(id));

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  res.end();
});

export default postRouter;
