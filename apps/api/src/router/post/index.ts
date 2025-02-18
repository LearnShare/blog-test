import {
  Router,
  Request,
  Response,
} from 'express';

import DB from '@packages/database';
import Auth from '@/lib/auth';

const postRouter = Router();

/**
 * get posts
 * query:
 * - search: title/content
 * - author: account.id
 * - sort: [-]ctime
 * - page
 * - size
 */
postRouter.get('/', async (req: Request, res: Response) => {
  const {
    search,
    author,
    sort,
    page,
    size,
  } = req.query;

  const {
    data,
    error,
  } = await DB.post.getPosts({
    search,
    author,
    sort,
    page,
    size,
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
    published = false,
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

export default postRouter;
