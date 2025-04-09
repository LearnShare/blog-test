import {
  Router,
  Request,
  Response,
} from 'express';

const helloRouter = Router();

helloRouter.get('/', async (req: Request, res: Response) => {
  res.end('hello');
});

helloRouter.get('/ip', async (req: Request, res: Response) => {
  res.end(`hello, ${req.ip}`);
});

export default helloRouter;
