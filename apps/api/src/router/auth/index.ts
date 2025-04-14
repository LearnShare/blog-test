import {
  Router,
  Request,
  Response,
} from 'express';
import he from 'he';

import BlogError from '@packages/lib/error';
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
import type { PostStatus } from '@packages/types';

const authRouter = Router();

const MAIL_LIMITS = 3;

async function generateCodeAndSendEmail(accountId: number, email: string, res: Response) {
  const code = Hash.generateRandomNumber(6);
  const {
    data: activationCode,
  } = await DB.code.createCode(accountId, {
    type: 'ACCOUNT_VERIFICATION',
    code,
    etime: new Date(
      Date.now()
      + Number(process.env.ACCOUNT_VERIFICATION_CODE_EXPIRES)
    ),
  });

  const {
    data,
  } = await DB.code.countCodeByAccountId(accountId);

  if (data
      && data.count <= MAIL_LIMITS) {
    // 6. send email
    await Mail.send(
      email,
      '欢迎来到 Blog，请激活您的账号',
      `账号激活代码: ${code}`,
    );
  }
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
    throw new BlogError({
      status: 400,
      message: 'Invalid email',
    });
  }

  // 2. validate password
  const passwordResult = Validator.validatePassword(password);
  if (!passwordResult.success) {
    throw new BlogError({
      status: 400,
      message: 'Invalid password',
    });
  }

  // 3. check is account exist
  const {
    data: existingAccount,
  } = await DB.account.getAccountByEmail(email);

  if (existingAccount) {
    throw new BlogError({
      status: 400,
      message: 'Account already exists',
    });
  }

  // 4. create new account
  const hash = await Hash.hashPassword(password);

  const {
    data: account,
  } = await DB.account.createAccount({
    email,
    password: hash,
  });

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
  } = await DB.account.getAccountById(id);

  // 1. check verified
  const {
    email,
    verified,
  } = data;
  if (verified) {
    res.end();
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
  } = await DB.code.searchCode({
    account: id,
    code,
  });

  if (!data) {
    throw new BlogError({
      status: 400,
      message: 'Invalid verification code',
    });
  }

  // 2. check code data
  const {
    used,
    etime,
  } = data;

  if (used
      || etime < new Date()) {
    throw new BlogError({
      status: 400,
      message: 'Invalid verification code',
    });
  }

  // 3. set code used
  await DB.code.updateCode(data.id, {
    used: true,
  });

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
    throw new BlogError({
      status: 400,
      message: 'Invalid email',
    });
  }

  // 2. check is account exist
  const {
    data: account,
  } = await DB.account.getAccountByEmail(email);

  // 3. check password
  let passwordMatch = false;
  if (account) {
    passwordMatch = await Hash.checkPassword(password, account.password);
  }

  if (!account
      || !passwordMatch) {
    throw new BlogError({
      status: 400,
      message: 'Account or Password error',
    });
  }

  // 4. check disabled status
  if (account.disabled) {
    throw new BlogError({
      status: 403,
      message: 'Account disabled',
    });
  }

  // 5. JWT token
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

    // HTML.escape
    const safeData = {};
    for (const key in req.body) {
      const str = req.body[key] as string;
      const value = str.trim();

      if (key !== 'intro'
          && !value) {
        throw new BlogError({
          status: 400,
          message: `Invalid data, ${key}: ${str}`,
        });
      }

      safeData[key] = he.escape(value);
    }

    updateAccount(id, safeData, res);
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
  } = await DB.account.getAccountByEmail(email);

  if (!account) {
    throw new BlogError({
      status: 404,
      message: 'Account not found',
    });
  }

  // 2. generate token and send email
  const code = Hash.uuid();
  const {
    data: activationCode,
  } = await DB.code.createCode(account.id, {
    type: 'RESET_PASSWORD',
    code,
    etime: new Date(
      Date.now()
      + Number(process.env.ACCOUNT_VERIFICATION_CODE_EXPIRES)
    ),
  });

  const {
    data,
  } = await DB.code.countCodeByAccountId(account.id);

  if (data
      && data.count <= MAIL_LIMITS) {
    // 6. send email
    await Mail.send(
      email,
      '重置 Blog 账号的密码',
      `访问链接，然后设置新的密码 ${process.env.WEB_HOST}/reset?token=${code}`,
    );
  }

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
  } = await DB.code.searchCode({
    code: token,
  });

  if (!data) {
    throw new BlogError({
      status: 400,
      message: 'Invalid reset token',
    });
  }

  // 2. check code data
  const {
    used,
    etime,
  } = data;

  if (used
      || etime < new Date()) {
    throw new BlogError({
      status: 400,
      message: 'Invalid reset token',
    });
  }

  // 3. set code used
  await DB.code.updateCode(data.id, {
    used: true,
  });

  // 4. check account
  const {
    data: account,
  } = await DB.account.getAccountById(data.account);

  if (!account) {
    throw new BlogError({
      status: 404,
      message: 'Account not found',
    });
  }

  // 5. validate password
  const passwordResult = Validator.validatePassword(password);
  if (!passwordResult.success) {
    throw new BlogError({
      status: 400,
      message: 'Invalid new password',
    });
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
    } = await DB.post.getStats(id);

    // 2. file stats
    const {
      data: fileStats,
    } = await DB.file.getStats(id);

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
      account,
      status,
      sort,
      page,
      size,
    } = req.query;

    const {
      data,
    } = await DB.post.getPosts({
      search: search as string,
      author: id,
      account: account
          ? Boolean(Number(account))
          : false,
      status: status as PostStatus,
      sort: (sort as string)
          || DB_SORT,
      page: page
          ? Number(page)
          : DB_PAGE,
      size: size
          ? Number(size)
          : DB_SIZE,
    });

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
    } = await DB.post.getPostByUid(uid);

    // 1. check post exist
    if (!post) {
      throw new BlogError({
        status: 404,
        message: 'Post not found',
      });
    }

    // 2. check post.author is me
    if (post.authorId
        !== id) {
      throw new BlogError({
        status: 403,
        message: 'Action not allowed',
      });
    }

    res.json(post);
  },
);

export default authRouter;
