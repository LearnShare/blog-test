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
    error,
  } = await DB.ticket.getTickets({
    type,
    status,
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

  console.log(req.body);

  if (type !== 'post-review') {
    res.status(400)
        .json({
           status: 400,
           message: 'Invalid action'
        });
    return;
  }

  const {
    data,
    error,
  } = await DB.ticket.reviewPost(Number(id), {
    postId,
    action,
    message,
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
});

export default ticketRouter;
