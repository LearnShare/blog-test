import {
  Request,
  Response,
  NextFunction,
} from 'express';

import BlogError from '@packages/lib/error';

// TODO handle errors
export default function error(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);

  if (err instanceof BlogError) {
    const {
      status = 400,
      message = 'Unknown error',
    } = err;

    res.status(status)
      .json({
        status,
        message: message,
      });
    return;
  } else {
    res.status(500)
      .json({
        status: 500,
        message: err,
      });
    return;
  }

  next();
}
