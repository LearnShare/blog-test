import {
  Router,
  Request,
  Response,
} from 'express';

import helloRouter from './hello';
import accountRouter from './account';
import postRouter from './post';

const router = Router();

router.use('/api/hello', helloRouter);
router.use('/api/account', accountRouter);
router.use('/api/post', postRouter);

// 404
router.use((req: Request, res: Response) => {
  res.status(404)
    .json({
      code: 404,
      message: `${ req.path } not found`,
    });
});

export default router;
