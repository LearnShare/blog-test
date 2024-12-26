import {
  Router,
  Request,
  Response,
} from 'express';

const helloRouter = Router();

helloRouter.get('/', async (req: Request, res: Response) => {
  res.end('hello');
});

export default helloRouter;
