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
import Hash from '@packages/lib/hash';

const postRouter = Router();

// TODO another API for private
/**
 * get posts
 * query:
 * - search: title/content
 * - author: account.id
 * - mine: 1|0
 * - account: 1|0
 * - published: 1|0
 * - sort: [-]ctime
 * - page
 * - size
 */
postRouter.get(
  '/',
  Auth.auto,
  async (req: Request, res: Response) => {
    const {
      search,
      published,
      author,
      mine,
      account,
      sort,
      page,
      size,
    } = req.query;

    const authorId = (mine === '1' && req.user?.id)
        ? req.user?.id
        : (author && Number(author));

    const {
      data,
      error,
    } = await DB.post.getPosts({
      search,
      author: authorId
          ? Number(authorId)
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
  },
);

/**
 * create post
 * body:
 * - title
 * - content
 * - published
 */
postRouter.post(
  '/',
  Auth.check,
  Auth.checkVerified,
  Auth.checkRole(['ADMIN', 'AUTHOR']),
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.user;
    const {
      title,
      intro,
      uid,
      content,
      format,
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

    if (uid) {
      // 2. check is uid exist
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

      if (post) {
        res.status(400)
            .json({
              status: 400,
              message: 'UID exists',
            });
        return;
      }
    }

    // 3. create post
    const {
      data: post,
      error,
    } = await DB.post.createPost(id, {
      title,
      intro,
      uid: uid
          ? uid
          : Hash.uuid(),
      content,
      format,
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
  },
);

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
postRouter.put(
  '/:id',
  Auth.check,
  Auth.checkVerified,
  Auth.checkRole(['ADMIN', 'AUTHOR']),
  async (req: Request, res: Response) => {
    const {
      id: userId,
    } = req.user;
    const {
      id,
    } = req.params;
    const postId = Number(id);

    // 1. check is post exist
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

    // 2. check author
    if (post.authorId !== userId) {
      res.status(403)
          .json({
            status: 403,
            message: 'Action not allowed',
          });
      return;
    }

    // 3. update post
    const {
      data: updatedPost,
      error: updateError,
    } = await DB.post.updatePost(postId, req.body);

    if (updateError) {
      res.status(500)
        .json({
          status: 500,
          message: updateError,
        });
      return;
    }

    res.json(updatedPost);
  },
);

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
