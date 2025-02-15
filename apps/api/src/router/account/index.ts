import {
  Router,
  Request,
  Response,
} from 'express';

import Validator from '@packages/lib/validator';
import Hash from '@packages/lib/hash';
import JWT from '@packages/lib/jwt';
import DB from '@packages/database';
import Auth from '@/lib/auth';

const accountRouter = Router();

/**
 * sign-up (create account)
 * body:
 * - email
 * - password
 */
accountRouter.post('/sign-up', async (req: Request, res: Response) => {
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
 * sign-in
 * body:
 * - email
 * - password
 */
accountRouter.post('/sign-in', async (req: Request, res: Response) => {
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

  try {
    // 2. check is account exist
    const account = await DB.account.getAccountByEmail(email);

    // 3. check password
    let passwordMatch = false;
    if (account) {
      passwordMatch = await Hash.checkPassword(password, account.password);
    }

    if (!account
        || !passwordMatch) {
      res.status(400)
          .json({
            status: 400,
            message: 'Account or Password error',
          });
      return;
    }

    // 4. JWT token
    const token = await JWT.encrypt({
      id: account.id,
    });

    res.json({
      ...account,
      token,
    });
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
 * get current account info
 */
accountRouter.get('/info', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.user;

  const account = await DB.account.getAccountById(id);

  res.json(account);
});

/**
 * get accounts
 * query:
 * - search: email/name
 */
accountRouter.get('/', async (req: Request, res: Response) => {
  const {
    search,
  } = req.query;

  // if (!search) {
  //   res.status(400)
  //       .json({
  //         status: 400,
  //         message: 'Search is empty',
  //       });
  // }

  const accounts = await DB.account.getAccounts(search);

  res.json(accounts);
});

export default accountRouter;
