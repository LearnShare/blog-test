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

const bookmarkRouter = Router();

/**
 * get mine bookmarks
 * query:
 * - sort: [-]ctime
 * - page
 * - size
 */
bookmarkRouter.get(
  '/',
  Auth.check,
  Auth.checkVerified,
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.user;
    const {
      sort,
      page,
      size,
    } = req.query;

    const {
      data,
      error,
    } = await DB.bookmark.getBookmarks({
      account: id,
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
 * create bookmark
 * body:
 * - postId
 */
bookmarkRouter.post(
  '/',
  Auth.check,
  Auth.checkVerified,
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.user;
    const {
      postId,
    } = req.body;

    // 1. check is exist
    const {
      bookmark: existsBookmark,
      error,
    } = await DB.bookmark.searchBookmark(id, postId);

    if (error) {
      res.status(500)
        .json({
          status: 500,
          message: error,
        });
      return;
    }

    if (existsBookmark) {
      res.status(400)
          .json({
            status: 400,
            message: 'Bookmark exists',
          });
      return;
    }

    // 2. create bookmark
    const {
      data: bookmark,
      error: createError,
    } = await DB.bookmark.createBookmark(id, postId);

    if (error) {
      res.status(500)
        .json({
          status: 500,
          message: error,
        });
      return;
    }

    res.json(bookmark);
  },
);

/**
 * get bookmark by post.id
 */
bookmarkRouter.get(
  '/:postId',
  Auth.check,
  Auth.checkVerified,
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.user;
    const {
      postId,
    } = req.params;

    const {
      data,
      error,
    } = await DB.bookmark.searchBookmark(id, Number(postId));

    if (error) {
      res.status(500)
        .json({
          status: 500,
          message: error,
        });
      return;
    }

    res.json({
      bookmarked: !!data?.list?.length,
    });
  },
);

/**
 * delete bookmark by post.id
 */
bookmarkRouter.delete(
  '/:postId',
  Auth.check,
  Auth.checkVerified,
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.user;
    const {
      postId,
    } = req.params;

    const {
      error,
    } = await DB.bookmark.deleteBookmark(id, Number(postId));

    if (error) {
      res.status(500)
        .json({
          status: 500,
          message: error,
        });
      return;
    }

    res.end();
  },
);

export default bookmarkRouter;
