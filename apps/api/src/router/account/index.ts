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

  const {
    data,
    error,
  } = await DB.account.getAccounts(search, sort, page, size);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

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

  // 3. check is account exist
  const {
    data: existingAccount,
    error,
  } = await DB.account.getAccountByEmail(email);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

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

  const {
    data: account,
    error: createError,
  } = await DB.account.createAccount(email, hash);

  if (createError) {
    res.status(500)
      .json({
        status: 500,
        message: createError,
      });
    return;
  }

  res.json(account);
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

  // 2. check is account exist
  const {
    data: account,
    error,
  } = await DB.account.getAccountByEmail(email);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

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
  const {
    id,
    name,
    ctime,
    utime,
  } = account;

  const token = await JWT.encrypt({
    id,
  });

  res.json({
    id,
    email,
    name,
    ctime,
    utime,
    token,
  });
});

async function getAccountInfo(id: string, res: Response) {
  // 1. check id
  if (!id) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid user id',
        });
    return;
  }

  const {
    data: account,
    error,
  } = await DB.account.getAccountById(id);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

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
    email,
    name,
    ctime,
    utime,
  } = account;

  res.json({
    id,
    email,
    name,
    ctime,
    utime,
  });
}

async function updateAccount(id: string, data: Record<string, any>, res: Response) {
  const {
    data: account,
    error,
  } = await DB.account.updateAccount(id, data);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  res.json(account);
}

async function updatePassword(id: string, oldPassword: string, password: string, res: Response) {
  // 1. check account and old password
  const {
    data: account,
    error,
  } = await DB.account.getAccountById(id);

  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  if (!account) {
    res.status(404)
        .json({
          status: 404,
          message: 'Account not found',
        });
    return;
  }

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
}

/**
 * get current account info
 */
accountRouter.get('/info', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.user;

  getAccountInfo(id, res);
});

/**
 * update account info
 */
accountRouter.put('/info', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.user;
  const {
    name,
  } = req.body;

  updateAccount(id, {
    name,
  }, res);
});

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
 * get account info by id
 */
accountRouter.get('/:id', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.params;

  getAccountInfo(id, res);
});

/**
 * update account info by id
 */
accountRouter.put('/:id', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.params;
  const {
    name,
  } = req.body;

  updateAccount(id, {
    name,
  }, res);
});

/**
 * update password by id
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
