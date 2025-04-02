import {
  Router,
  Request,
  Response,
} from 'express';

import Validator from '@packages/lib/validator';
import Hash from '@packages/lib/hash';
import JWT from '@packages/lib/jwt';
import DB, {
  DB_PAGE,
  DB_SIZE,
  DB_SORT,
} from '@packages/database';
import Auth, {
  type CustomRequest,
} from '@/lib/auth';
import {
  getAccountInfo,
  updateAccount,
  updatePassword,
} from '@/lib/account';
import Mail from '@/lib/mail';
import Redis from '@/lib/redis';

const authRouter = Router();

async function generateCodeAndSendEmail(accountId: number, email: string, res: Response) {
  const code = Hash.generateRandomNumber(6);
  const {
    data: activationCode,
    error: codeError,
  } = await DB.code.createCode(accountId, {
    type: 'ACCOUNT_VERIFICATION',
    code,
    etime: new Date(
      Date.now()
      + Number(process.env.ACCOUNT_VERIFICATION_CODE_EXPIRES)
    ),
  });
  if (codeError) {
    res.status(500)
      .json({
        status: 500,
        message: codeError,
      });
    return;
  }

  // 6. send email
  await Mail.send(
    email,
    'Welcome to Blog, please verify your account',
    `Account verification code: ${code}`,
  );
}

/**
 * sign-up (create account)
 * body:
 * - email
 * - password
 */
authRouter.post('/sign-up', async (req: Request, res: Response) => {
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
  } = await DB.account.createAccount({
    email,
    password: hash,
  });

  if (createError) {
    res.status(500)
      .json({
        status: 500,
        message: createError,
      });
    return;
  }

  // 5. generate and save verification code
  generateCodeAndSendEmail(account.id, email, res);

  res.json(account);
});

/**
 * verify account - send verification code
 */
authRouter.get('/verify', Auth.check, async (req: CustomRequest, res: Response) => {
  const {
    id,
  } = req.user;

  const {
    data,
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

  // 1. check verified
  const {
    email,
    verified,
  } = data;
  if (verified) {
    res.status(200)
        .json({
          status: 200,
          message: 'Account verified',
        });
    return;
  }

  // 2. generate and save verification code
  await generateCodeAndSendEmail(id, email, res);

  res.status(200)
      .json({
        status: 200,
        message: 'Email sent',
      });
});

/**
 * verify account - check verification code
 */
authRouter.post('/verify', Auth.check, async (req: CustomRequest, res: Response) => {
  const {
    id,
  } = req.user;
  const {
    code,
  } = req.body;

  // 1. search code data
  const {
    data,
    error,
  } = await DB.code.searchCode({
    account: id,
    code,
  });
  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  if (!data) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid verification code',
        });
    return;
  }

  // 2. check code data
  const {
    used,
    etime,
  } = data;

  if (used
      || etime < new Date()) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid verification code',
        });
    return;
  }

  // 3. set code used
  const {
    error: updateError,
  } = await DB.code.updateCode(data.id, {
    used: true,
  });
  if (updateError) {
    res.status(500)
      .json({
        status: 500,
        message: updateError,
      });
    return;
  }

  // 4. update account.verified
  updateAccount(id, {
    verified: true,
  }, res);
});

/**
 * sign-in
 * body:
 * - email
 * - password
 */
authRouter.post('/sign-in', async (req: Request, res: Response) => {
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
  } = account;

  const {
    password: accountPassword,
    ...rest
  } = account;

  await Redis.setAccountInfo(id, rest);

  const token = await JWT.encrypt({
    id,
  });

  res.cookie('BLOG_TOKEN', token, {
    maxAge: process.env.COOKIE_MAXAGE,
  });
  res.json({
    token,
    data: rest,
  });
});

/**
 * get current account info
 */
authRouter.get('/info', Auth.check, async (req: CustomRequest, res: Response) => {
  const {
    id,
  } = req.user;

  getAccountInfo(id, res);
});

/**
 * update account info
 */
authRouter.put(
  '/info',
  Auth.check,
  Auth.checkVerified,
  async (req: CustomRequest, res: Response) => {
    const {
      id,
    } = req.user;

    updateAccount(id, req.body, res);
  },
);

/**
 * forgot password - send reset token (url)
 */
authRouter.post('/forgot', async (req: Request, res: Response) => {
  const {
    email,
  } = req.body;

  // 1. check account
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
  if (!account) {
    res.status(404)
      .json({
        status: 404,
        message: 'Account not found',
      });
    return;
  }

  // 2. generate token and send email
  const code = Hash.uuid();
  const {
    data: activationCode,
    error: codeError,
  } = await DB.code.createCode(account.id, {
    type: 'RESET_PASSWORD',
    code,
    etime: new Date(
      Date.now()
      + Number(process.env.ACCOUNT_VERIFICATION_CODE_EXPIRES)
    ),
  });
  if (codeError) {
    res.status(500)
      .json({
        status: 500,
        message: codeError,
      });
    return;
  }

  // 6. send email
  await Mail.send(
    email,
    'Reset password for your Blog account',
    `Reset password: http://blog.dev/reset?token=${code}`,
  );

  res.status(200)
      .json({
        status: 200,
        message: 'Link sent',
      });
});

/**
 * forgot password - check reset token, and set new password
 */
authRouter.post('/reset', async (req: Request, res: Response) => {
  const {
    token,
    password,
  } = req.body;

  // 1. search code data
  const {
    data,
    error,
  } = await DB.code.searchCode({
    code: token,
  });
  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }
  if (!data) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid reset token',
        });
    return;
  }

  // 2. check code data
  const {
    used,
    etime,
  } = data;

  if (used
      || etime < new Date()) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid reset token',
        });
    return;
  }

  // 3. set code used
  const {
    error: updateError,
  } = await DB.code.updateCode(data.id, {
    used: true,
  });
  if (updateError) {
    res.status(500)
      .json({
        status: 500,
        message: updateError,
      });
    return;
  }

  // 4. check account
  const {
    data: account,
    error: accountError,
  } = await DB.account.getAccountById(data.account);
  if (accountError) {
    res.status(500)
      .json({
        status: 500,
        message: accountError,
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

  // 5. validate password
  const passwordResult = Validator.validatePassword(password);
  if (!passwordResult.success) {
    res.status(400)
        .json({
          status: 400,
          message: 'Invalid new password',
        });
    return;
  }

  // 6. update password
  const hash = await Hash.hashPassword(password);

  updateAccount(data.account, {
    password: hash,
    verified: true,
  }, res);
});

/**
 * update password
 */
authRouter.put(
  '/password',
  Auth.check,
  Auth.checkVerified,
  async (req: CustomRequest, res: Response) => {
    const {
      id,
    } = req.user;
    const {
      oldPassword,
      password,
    } = req.body;

    updatePassword(id, oldPassword, password, res);
  },
);

/**
 * get account stats
 */
authRouter.get(
  '/stats',
  Auth.check,
  Auth.checkVerified,
  async (req: CustomRequest, res: Response) => {
    const {
      id,
    } = req.user;

    // 1. post stats
    const {
      data: postStats,
      error: postError,
    } = await DB.post.getStats(id);
    if (postError) {
      res.status(500)
        .json({
          status: 500,
          message: postError,
        });
      return;
    }

    // 2. file stats
    const {
      data: fileStats,
      error: fileError,
    } = await DB.file.getStats(id);
    if (fileError) {
      res.status(500)
        .json({
          status: 500,
          message: fileError,
        });
      return;
    }

    res.json({
      post: postStats,
      file: fileStats,
    });
  },
);

/**
 * get account posts
 */
authRouter.get(
  '/post',
  Auth.check,
  async (req: CustomRequest, res: Response) => {
    const {
      id,
    } = req.user;

    const {
      search,
      published,
      account,
      sort,
      page,
      size,
    } = req.query;

    const {
      data,
      error,
    } = await DB.post.getPosts({
      search: search as string,
      author: id,
      account: account
          ? Boolean(Number(account))
          : false,
      published: published
          ? Boolean(Number(published))
          : null,
      sort: (sort as string)
          || DB_SORT,
      page: page
          ? Number(page)
          : DB_PAGE,
      size: size
          ? Number(size)
          : DB_SIZE,
    });

    if (error) {
      res.status(500)
        .json({
          status: 500,
          message: error,
        });
      return;
    }

    res.json(data);
  },
);

/**
 * get post by uid
 */
authRouter.get(
  '/post/:uid',
  Auth.check,
  async (req: CustomRequest, res: Response) => {
    const {
      uid,
    } = req.params;
    const {
      id,
    } = req.user;

    const {
      data: post,
      error,
    } = await DB.post.getPostByUid(uid);

    if (error) {
      res.status(500)
        .json({
          status: 500,
          message: error,
        });
      return;
    }

    // 1. check post exist
    if (!post) {
      res.status(404)
          .json({
            status: 404,
            message: 'Post not found',
          });
      return;
    }

    // 2. check post.author is me
    if (post.authorId
        !== id) {
      res.status(403)
          .json({
            status: 403,
            message: 'Action not allowed',
          });
      return;
    }

    res.json(post);
  },
);

export default authRouter;
