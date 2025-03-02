import {
  Router,
  Request,
  Response,
} from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';

import Validator from '@packages/lib/validator';
import Hash from '@packages/lib/hash';
import JWT from '@packages/lib/jwt';
import DB, {
  DB_PAGE,
  DB_SIZE,
  DB_SORT,
} from '@packages/database';
import Auth from '@/lib/auth';
import {
  getAccountInfo,
  updateAccount,
  updatePassword,
} from '@/lib/account';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 1024 * 1024,
  },
  storage: multer.memoryStorage(),
});

const authRouter = Router();

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
    name,
    ctime,
    utime,
  } = account;

  const token = await JWT.encrypt({
    id,
  });

  res.json({
    token,
    data: {
      id,
      email,
      name,
      ctime,
      utime,
    },
  });
});

/**
 * get current account info
 */
authRouter.get('/info', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.user;

  getAccountInfo(id, res);
});

/**
 * update account info
 */
authRouter.put('/info', Auth.check, async (req: Request, res: Response) => {
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

const avatarAcceptTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

/**
 * upload avatar
 */
authRouter.post(
  '/avatar',
  Auth.check,
  upload.single('avatar'),
  async (req: Request, res: Response) => {
    const {
      id,
    } = req.user;

    const {
      originalname,
      mimetype,
      size,
      buffer,
    } = req.file;

    // 1. check mime
    if (!avatarAcceptTypes.includes(mimetype)) {
      res.status(400)
        .json({
          status: 400,
          message: `Invalid file type [${mimetype}]`,
        });
      return;
    }

    // 2. hash data
    const hash = crypto.hash('sha256', buffer);
    console.log(hash);

    // 3. check exists
    const {
      data: existingFile,
      error,
    } = await DB.file.getFileByHash(hash);
    if (error) {
      res.status(500)
        .json({
          status: 500,
          message: error,
        });
      return;
    }

    if (existingFile) {
      updateAccount(id, {
        avatar: existingFile.id,
      }, res);
    } else {
      // 4. write data to file
      const dotIndex = originalname.lastIndexOf('.');
      const ext = originalname.substring(dotIndex + 1);
      const destPath = 'uploads/avatar/';
      console.log(destPath);
      try {
        fs.mkdirSync(destPath, {
          recursive: true,
        });
        fs.writeFileSync(`${destPath}${hash}.${ext}`, buffer, {
          flag: 'a',
        });
      } catch (error) {
        console.log(error);
        res.status(500)
          .json({
            status: 500,
            message: error,
          });
        return;
      }

      // 5. create file
      const {
        data: file,
        error: createError,
      } = await DB.file.createFile(id, {
        hash,
        type: 'IMAGE',
        mime: mimetype,
        name: originalname.substring(0, dotIndex),
        ext,
        size,
      });
      if (createError) {
        res.status(500)
          .json({
            status: 500,
            message: createError,
          });
        return;
      }

      updateAccount(id, {
        avatar: file.id,
      }, res);
    }
  },
);

/**
 * update password
 */
authRouter.put('/password', Auth.check, async (req: Request, res: Response) => {
  const {
    id,
  } = req.user;
  const {
    oldPassword,
    password,
  } = req.body;

  updatePassword(id, oldPassword, password, res);
});

export default authRouter;
