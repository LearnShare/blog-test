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
 * get accounts
 * query:
 * - search: email/name
 * - sort: [-]ctime
 */
accountRouter.get('/', async (req: Request, res: Response) => {
  const {
    search,
    sort,
    page,
    size,
  } = req.query;

  const data = await DB.account.getAccounts(search, sort, page, size);

  res.json(data);
});

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
    const hash = await Hash.hashPassword(password);
    const account = await DB.account.createAccount(email, hash);

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
    const {
      id,
      name,
      ctime,
    } = account;

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
      id,
      email,
      name,
      ctime,
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

async function getAccountById(id: string, res: Response) {
  // 1. check id
  if (!id) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid user id',
        });
    return;
  }

  try {
    const account = await DB.account.getAccountById(id);

    // 2. check is account exist
    if (!account) {
      res.status(404)
          .json({
            status: 404,
            message: 'User not found',
          });
      return;
    }

    const {
      id,
      email,
      name,
      ctime,
    } = account;

    res.json({
      id,
      email,
      name,
      ctime,
    });
  } catch (error) {
    console.log(error);
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
  }
}

/**
 * get current account info
 */
accountRouter.get('/info', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.user;

  getAccountById(id, res);
});

/**
 * get account info by id
 */
accountRouter.get('/:id', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.params;

  getAccountById(id, res);
});

async function updateAccount(id: string, data: Record<string, any>, res: Response) {
  try {
    const account = await DB.account.updateAccount(id, data);

    res.json(account);
  } catch (error) {
    console.log(error);
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
  }
}

async function updatePassword(id: string, oldPassword: string, password: string, res: Response) {
  try {
    // 1. check old password
    const account = await DB.account.getAccountById(id);

    const match = await Hash.checkPassword(oldPassword, account.password);

    if (!match) {
      res.status(400)
          .json({
            status: 400,
            message: 'Old Password error',
          });
      return;
    }

    // 2. validate password
    const passwordResult = Validator.validatePassword(password);
    if (!passwordResult.success) {
      res.status(400)
          .json({
            status: 400,
            message: 'Invalid new password',
          });
      return;
    }

    // 3. update password
    const hash = await Hash.hashPassword(password);
    updateAccount(id, {
      password: hash,
    }, res);
  } catch (error) {
    console.log(error);
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
  }
}

/**
 * update password
 */
accountRouter.put('/password', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.user;
  const {
    oldPassword,
    password,
  } = req.body;

  updatePassword(id, oldPassword, password, res);
});

/**
 * update password
 */
accountRouter.put('/:id/password', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.params;
  const {
    oldPassword,
    password,
  } = req.body;

  updatePassword(id, oldPassword, password, res);
});

export default accountRouter;
