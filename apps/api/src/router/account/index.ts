import {
  Router,
  Request,
  Response,
} from 'express';
import DB from '@packages/database';

const accountRouter = Router();

accountRouter.get('/', async (req: Request, res: Response) => {
  const info = await DB.account.getAccountInfo('abc@test.com');

  res.json(info);
});

export default accountRouter;
