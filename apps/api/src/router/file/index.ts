import {
  Router,
  Request,
  Response,
} from 'express';
import fs from 'node:fs';
import process from 'node:process';


import DB from '@packages/database';
const fileRouter = Router();

/**
 * get file by id
 */
fileRouter.get('/:type/:id', async (req: Request, res: Response) => {
  const {
    type,
    id,
  } = req.params;

  const {
    data: file,
    error,
  } = await DB.file.getFileById(Number(id));
  if (error) {
    res.status(500)
      .json({
        status: 500,
        message: error,
      });
    return;
  }

  if (!file) {
    res.status(404)
        .json({
          status: 404,
          message: 'File not found',
        });
    return;
  }

  const {
    hash,
    mime,
    ext,
  } = file;

  const fullPath = `uploads/${type}/${hash}.${ext}`;
  const exist = fs.existsSync(fullPath);
  if (!exist) {
    res.status(404)
        .json({
          status: 404,
          message: 'File not found',
        });
    return;
  }

  res.set('Content-Type', mime)
      .sendFile(`${process.cwd()}/${fullPath}`);
});

export default fileRouter;
