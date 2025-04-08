import {
  Router,
  Request,
  Response,
} from 'express';
import he from 'he';
import DOMPurify from 'dompurify';
import {
  JSDOM,
} from 'jsdom';

const jsdomWindow = new JSDOM('').window;
const purify = DOMPurify(jsdomWindow);

import BlogError from '@packages/lib/error';
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
    if (!title.trim()
        || !content.trim()) {
      throw new BlogError({
        status: 400,
        message: 'Title and Content required',
      });
    }

    if (uid) {
      // 2. check is uid exist
      const {
        data: post,
      } = await DB.post.getPostByUid(uid);

      if (post) {
        throw new BlogError({
          status: 400,
          message: 'UID exists',
        });
      }
    }

    const safeData = {
      title: he.escape(title.trim()),
      intro: he.escape(intro.trim()),
      uid: uid
          ? uid
          : Hash.uuid(),
      cover,
      coverUrl,
      content: purify.sanitize(content),
      format: format as PostContentFormat,
      status: 'draft',
    };

    // 3. create post
    const {
      data: post,
    } = await DB.post.createPost(id, safeData);

    // 4. create ticket
    const {
      data: ticket,
    } = await DB.ticket.createTicket({
      type: 'post',
      ref: String(post.id),
      from: id,
      status: 'pending',
    });

    // 5. update post
    const {
      data: updatedPost,
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
  } = await DB.post.getPostByUid(uid);

  if (!post
      || post.status !== 'public') {
    throw new BlogError({
      status: 404,
      message: 'Post not found',
    });
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
  } = await DB.post.getPostById(Number(id));

  if (!post
      || post.status !== 'public') {
    throw new BlogError({
      status: 404,
      message: 'Post not found',
    });
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
    if (!title.trim()
        || !content.trim()) {
      throw new BlogError({
        status: 400,
        message: 'Title and Content required',
      });
    }

    // 2. check is post exist
    const {
      data: post,
    } = await DB.post.getPostById(postId);

    if (!post) {
      throw new BlogError({
        status: 404,
        message: 'Post not found',
      });
    }

    // 3. check author
    if (post.authorId !== userId) {
      throw new BlogError({
        status: 403,
        message: 'Action not allowed',
      });
    }

    if (uid) {
      // 4. check is uid exist
      const {
        data: post,
      } = await DB.post.getPostByUid(uid);

      if (post
          && post.id !== postId) {
        throw new BlogError({
          status: 400,
          message: 'UID exists',
        });
      }
    }

    // 5. create ticket
    const {
      data: ticket,
    } = await DB.ticket.createTicket({
      type: 'post',
      ref: String(post.id),
      from: userId,
      status: 'pending',
    });

    const safeData = {
      title: he.escape(title.trim()),
      intro: he.escape(intro.trim()),
      uid: uid
          ? uid
          : Hash.uuid(),
      cover,
      coverUrl,
      content: purify.sanitize(content),
      format: format as PostContentFormat,
      status: 'draft',
      ticket: ticket.id,
    };

    // 6. update post
    const {
      data: updatedPost,
    } = await DB.post.updatePost(postId, safeData);

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
  } = await DB.post.getPostById(Number(id));

  if (!post) {
    throw new BlogError({
      status: 404,
      message: 'Post not found',
    });
  }

  await DB.post.deletePost(Number(id));

  res.end();
});

export default postRouter;
