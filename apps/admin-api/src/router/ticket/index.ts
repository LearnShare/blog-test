import {
  Router,
  Request,
  Response,
} from 'express';

import DB, {
  DB_PAGE,
  DB_SIZE,
  DB_SORT,
} from '@packages/database';
import type {
  CustomRequest,
} from '@/lib/auth';

const ticketRouter = Router();

/**
 * get tickets
 * query:
 * - type
 * - status
 * - sort: [-]ctime
 * - page
 * - size
 */
ticketRouter.get('/', async (req: CustomRequest, res: Response) => {
  const {
    type,
    status,
    sort,
    page,
    size,
  } = req.query;

  const {
    data,
  } = await DB.ticket.getTickets({
    type: type as string,
    status: status as string,
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
});

/**
 * review post
 */
ticketRouter.put('/:id', async (req: CustomRequest, res: Response) => {
  const {
    id,
  } = req.params;

  const {
    type,
    postId,
    action,
    message,
  } = req.body;

  if (type !== 'post-review') {
    res.status(400)
        .json({
           status: 400,
           message: 'Invalid action'
        });
    return;
  }

  await DB.ticket.reviewPost(Number(id), {
    postId,
    action,
    message,
  });

  res.json();
});

export default ticketRouter;
