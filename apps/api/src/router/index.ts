import {
  Router,
  Request,
  Response,
} from 'express';

import helloRouter from './hello';
import fileRouter from './file';
import authRouter from './auth';
import accountRouter from './account';
import authorRouter from './author';
import postRouter from './post';
import bookmarkRouter from './bookmark';

const router = Router();

router.use('/api/hello', helloRouter);
router.use('/api/file', fileRouter);
router.use('/api/auth', authRouter);
router.use('/api/account', accountRouter);
router.use('/api/author', authorRouter);
router.use('/api/post', postRouter);
router.use('/api/bookmark', bookmarkRouter);

// 404
router.use((req: Request, res: Response) => {
  res.status(404)
    .json({
      status: 404,
      message: `${ req.path } not found`,
    });
});

export default router;
