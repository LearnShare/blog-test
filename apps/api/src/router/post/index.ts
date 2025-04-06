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
 * - account: 1|0
 * - sort: [-]ctime
 * - page
 * - size
 */
postRouter.get('/', async (req: CustomRequest, res: Response) => {
  const {
    search,
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
    search: search as string,
    author: author
        ? Number(author)
        : null,
    account: account
        ? Boolean(Number(account))
        : false,
    bookmarkBy: req.user && req.user.id,
    // only published visible
    status: 'public',
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
  async (req: CustomRequest, res: Response) => {
    const {
      id,
    } = req.user;
    const {
      title,
      intro,
      uid,
      cover,
      coverUrl,
      content,
      format,
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
      cover,
      coverUrl,
      content,
      format: format as PostContentFormat,
      status: 'draft',
    });

    if (error) {
      res.status(500)
        .json({
          status: 500,
          message: error,
        });
      return;
    }

    // 4. create ticket
    const {
      data: ticket,
      error: ticketError,
    } = await DB.ticket.createTicket({
      type: 'post',
      ref: String(post.id),
      from: id,
      status: 'pending',
    });

    if (ticketError) {
      res.status(500)
        .json({
          status: 500,
          message: ticketError,
        });
      return;
    }

    console.log(ticket, ticketError);

    // 5. update post
    const {
      data: updatedPost,
      error: updateError,
    } = await DB.post.updatePost(post.id, {
      ticket: ticket.id,
    });

    res.json(updatedPost);
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

  if (!post
      || post.status !== 'public') {
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
      || post.status !== 'public') {
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
  async (req: CustomRequest, res: Response) => {
    const {
      id: userId,
    } = req.user;
    const {
      id,
    } = req.params;
    const postId = Number(id);

    const {
      title,
      intro,
      uid,
      cover,
      coverUrl,
      content,
      format,
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

    if (uid) {
      // 4. check is uid exist
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

      if (post
          && post.id !== postId) {
        res.status(400)
            .json({
              status: 400,
              message: 'UID exists',
            });
        return;
      }
    }

    // 5. create ticket
    const {
      data: ticket,
      error: ticketError,
    } = DB.ticket.createTicket({
      type: 'post',
      ref: String(post.id),
      from: userId,
      status: 'pending',
    });

    if (ticketError) {
      res.status(500)
        .json({
          status: 500,
          message: ticketError,
        });
      return;
    }

    // 6. update post
    const {
      data: updatedPost,
      error: updateError,
    } = await DB.post.updatePost(postId, {
      title,
      intro,
      uid: uid
          ? uid
          : Hash.uuid(),
      cover,
      coverUrl,
      content,
      format: format as PostContentFormat,
      status: 'draft',
      ticket: ticket.id,
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
