import {
  Router,
  Request,
  Response,
} from 'express';

import helloRouter from './hello';
import accountRouter from './account';

const router = Router();

router.use('/api/hello', helloRouter);
router.use('/api/account', accountRouter);

router.all(':empty', (req: Request, res: Response) => {
  res.status(404)
    .send(`${ req.path } not found.`);
});

export default router;
