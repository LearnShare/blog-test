import {
  Request,
  Response,
  NextFunction,
} from 'express';

import JWT from '@packages/lib/jwt';

async function check(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.get('Authorization');
  const token = authHeader
      && authHeader.split(' ')[1];

  if (!authHeader
      || !token) {
    res.status(403)
        .JSON({
          code: 403,
          message: 'You should login first',
        });
    return;
  }

  try {
    const data = await JWT.decrypt(token);

    req.user = data;

    next();
  } catch (error) {
    console.log(error);
    res.status(403)
        .JSON({
          code: 403,
          message: 'Invalid token',
        });
    return;
  }
}

export default {
  check,
};
