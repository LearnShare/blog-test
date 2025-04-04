import {
  Request,
  Response,
  NextFunction,
} from 'express';

export default function log(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(new Date().toTimeString().substring(0, 9));
  console.log(req.method, req.path, '\n');

  next();
}
