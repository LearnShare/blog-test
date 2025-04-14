import {
  Router,
  Request,
  Response,
} from 'express';

import BlogError from '@packages/lib/error';
import Auth, {
  type CustomRequest,
} from '@/lib/auth';

import helloRouter from './hello';
import authRouter from './auth';
import accountRouter from './account';
import postRouter from './post';
import ticketRouter from './ticket';

const router = Router();

router.use('/hello', helloRouter);
router.use('/auth', authRouter);
router.use('/account', Auth.check, accountRouter);
router.use('/post', Auth.check, postRouter);
router.use('/ticket', Auth.check, ticketRouter);

// 404
router.use((req: Request, res: Response) => {
  throw new BlogError({
    status: 404,
    message: `${ req.path } not found`,
  });
});

export default router;
