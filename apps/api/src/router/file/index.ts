import fs from 'node:fs';
import process from 'node:process';

import {
  Router,
  Request,
  Response,
} from 'express';
import multer from 'multer';

import BlogError from '@packages/lib/error';
import DB, {
  DB_PAGE,
  DB_SIZE,
  DB_SORT,
} from '@packages/database';
import Hash from '@packages/lib/hash';
import Auth, {
  type CustomRequest,
} from '@/lib/auth';
import {
  updateAccount,
} from '@/lib/account';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 1024 * 1024,
  },
  storage: multer.memoryStorage(),
});

const fileRouter = Router();

/**
 * get files
 * query:
 * - creator: account.id
 * - sort: [-]ctime
 * - page
 * - size
 */
fileRouter.get(
  '/',
  Auth.check,
  Auth.checkVerified,
  async (req: Request, res: Response) => {
    const {
      creator,
      sort,
      page,
      size,
    } = req.query;

    const {
      data,
    } = await DB.file.getFiles({
      creator: creator
          ? Number(creator)
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

    res.json(data);
  },
);

const acceptMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
];
const acceptUploadTypes = [
  'account-avatar',
  'post-cover',
];

const host = process.env.SERVER_HOST;
const serverHost = `${host}/api/file/hash`;

async function continueUpload(
  accountId: number,
  file: any,
  type: typeof acceptUploadTypes[number],
  res: Response,
) {
  const url = `${serverHost}/${file.hash}`;

  switch (type) {
    case 'account-avatar':
      updateAccount(accountId, {
        avatar: file.id,
        avatarUrl: url,
      }, res);
      break;
    case 'post-cover':
      res.json({
        id: file.id,
        url,
      });
      break;
    default:
      throw new BlogError({
        status: 400,
        message: 'Invalid action',
      });
  }
}

/**
 * upload file
 */
fileRouter.post(
  '/',
  Auth.check,
  Auth.checkVerified,
  Auth.checkFileLimits,
  upload.single('file'),
  async (req: CustomRequest, res: Response) => {
    const {
      id,
    } = req.user;
    const {
      type,
    } = req.body;
    const {
      originalname,
      mimetype,
      size,
      buffer,
    } = req.file;

    // 1. check mime and type
    if (!acceptMimeTypes.includes(mimetype)
        || !acceptUploadTypes.includes(type)) {
      throw new BlogError({
        status: 400,
        message: 'Invalid data',
      });
    }

    // 2. hash data
    const hash = Hash.hashData(buffer);

    // 3. check exists
    const {
      data: existingFile,
    } = await DB.file.getFileByHash(hash);

    if (!existingFile) {
      // 4. write data to file
      const dotIndex = originalname.lastIndexOf('.');
      const ext = originalname.substring(dotIndex + 1);
      const destPath = `uploads/${hash.substring(0, 2)}/`;

      try {
        fs.mkdirSync(destPath, {
          recursive: true,
        });
        fs.writeFileSync(`${destPath}${hash}.${ext}`, buffer, {
          flag: 'a',
        });
      } catch (error) {
        throw new BlogError({
          status: 500,
          message: error,
        });
      }

      // 5. create file
      const {
        data: file,
      } = await DB.file.createFile(id, {
        hash,
        type: 'IMAGE',
        mime: mimetype,
        name: originalname.substring(0, dotIndex),
        ext,
        size,
      });

      continueUpload(id, file, type, res);
    } else {
      continueUpload(id, existingFile, type, res);
    }
  },
);

interface FileData {
  hash: string;
  mime: string;
  ext: string;
}

async function returnFile(file: FileData, res: Response) {
  const {
    hash,
    mime,
    ext,
  } = file;

  const fullPath = `uploads/${hash.substring(0, 2)}/${hash}.${ext}`;

  const exist = fs.existsSync(fullPath);
  if (!exist) {
    throw new BlogError({
      status: 404,
      message: 'File not found',
    });
  }

  res.set('Content-Type', mime)
      .sendFile(`${process.cwd()}/${fullPath}`);
}

/**
 * get file by hash
 */
fileRouter.get('/hash/:hash', async (req: Request, res: Response) => {
  const {
    hash,
  } = req.params;

  const {
    data: file,
  } = await DB.file.getFileByHash(hash);

  if (!file) {
    throw new BlogError({
      status: 404,
      message: 'File not found',
    });
  }

  returnFile(file, res);
});

/**
 * get file by id
 */
fileRouter.get('/:id', async (req: Request, res: Response) => {
  const {
    id,
  } = req.params;

  const {
    data: file,
  } = await DB.file.getFileById(Number(id));

  if (!file) {
    throw new BlogError({
      status: 404,
      message: 'File not found',
    });
  }

  returnFile(file, res);
});

/**
 * delete avatar
 */
fileRouter.delete(
  '/avatar',
  Auth.check,
  Auth.checkVerified,
  async (req: CustomRequest, res: Response) => {
    const {
      id,
    } = req.user;

    updateAccount(id, {
      avatar: null,
      avatarUrl: '',
    }, res);
  },
);

export default fileRouter;
