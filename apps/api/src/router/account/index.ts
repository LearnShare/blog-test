import {
  Router,
  Request,
  Response,
} from 'express';

import Validator from '@packages/lib/validator';
import DB from '@packages/database';

const accountRouter = Router();

console.log(Validator);

/**
 * create account
 * body:
 * - email
 * - password
 */
accountRouter.post('/', async (req: Request, res: Response) => {
  const {
    email,
    password,
  } = req.body;

  // 1. validate email
  const emailResult = Validator.validateEmail(email);
  if (!emailResult.success) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid email',
        });
    return;
  }

  // 2. validate password
  const passwordResult = Validator.validatePassword(password);
  if (!passwordResult.success) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid password',
        });
    return;
  }

  try {
    // 3. check is account exist
    const existingAccount = await DB.account.getAccountByEmail(email);

    if (existingAccount) {
      res.status(400)
          .json({
            status: 400,
            message: 'Account already exists',
          });
      return;
    }

    // 4. create new account
    const account = await DB.account.createAccount(email, password);

    console.log(account);

    res.json(account);
    return;
  } catch (error) {
    console.log(error);
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
  }
});

/**
 * search account
 * query:
 * - search: email/name
 */
accountRouter.get('/', async (req: Request, res: Response) => {
  const {
    search,
  } = req.query;

  if (!search) {
    res.status(400)
        .json({
          status: 400,
          message: 'Search is empty',
        });
  }

  const accounts = await DB.account.searchAccount(search);

  res.json(accounts);
});

export default accountRouter;
