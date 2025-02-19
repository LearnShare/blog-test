import {
  Router,
  Request,
  Response,
} from 'express';

import DB, {
  DB_PAGE,
  DB_SIZE,
  DB_SORT,
} from '@packages/database';
import Auth from '@/lib/auth';

const postRouter = Router();

/**
 * get posts
 * query:
 * - search: title/content
 * - author: account.id
 * - account: 1|0
 * - published: 1|0
 * - sort: [-]ctime
 * - page
 * - size
 */
postRouter.get('/', async (req: Request, res: Response) => {
  const {
    search,
    published,
    author,
    account,
    sort,
    page,
    size,
  } = req.query;

  const {
    data,
    error,
  } = await DB.post.getPosts({
    search,
    author: author
        ? Number(author)
        : null,
    account: account
        ? Boolean(Number(account))
        : false,
    published: published
        ? Boolean(Number(published))
        : null,
    sort: sort
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
 * create post
 * body:
 * - title
 * - content
 * - published
 */
postRouter.post('/', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.user;
  const {
    title,
    content,
    published,
  } = req.body;

  // 1. check title and content
  if (!title
      || !content) {
    res.status(400)
        .json({
          status: 400,
          message: 'Title and Content required',
        });
    return;
  }

  // 2. create post
  const {
    data: post,
    error,
  } = await DB.post.createPost(id, {
    title,
    content,
    published,
  });

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

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

  if (!post) {
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
 * update post by id
 */
postRouter.put('/:id', Auth.check, async (req: Request, res: Response) => {
  const {
    id: userId,
  } = req.user;
  const {
    id,
  } = req.params;
  const postId = Number(id);
  const {
    title,
    content,
    published,
  } = req.body;

  // 1. check title and content
  if (!title
      || !content) {
    res.status(400)
        .json({
          status: 400,
          message: 'Title and Content required',
        });
    return;
  }

  // 2. check is post exist
  const {
    data: post,
    error,
  } = await DB.post.getPostById(postId);

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

  // 3. check author
  if (post.authorId !== userId) {
    res.status(403)
        .json({
          status: 403,
          message: 'Action not allowed',
        });
    return;
  }

  // 4. update post
  const {
    data: updatedPost,
    error: updateError,
  } = await DB.post.updatePost(postId, {
    title,
    content,
    published,
  });

  if (updateError) {
    res.status(500)
      .json({
        status: 500,
        message: updateError,
      });
    return;
  }

  res.json(updatedPost);
});

export default postRouter;
