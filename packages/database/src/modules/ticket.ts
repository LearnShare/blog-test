import prisma from '../prisma';
import postModule from './post';
import {
  type TicketType,
  type TicketStatus,
  TicketStatusEnums,
  PostStatusEnums,
} from '@packages/types';

interface TicketData {
  type: TicketType;
  ref?: string;
  from?: number;
  to?: number;
  status: TicketStatus;
}

// create ticket
async function createTicket(ticketData: TicketData) {
  const {
    type,
    ref,
    from,
  } = ticketData;

  // delete old tickets
  await prisma.ticket.deleteMany({
    where: {
      type,
      ref,
      from,
    },
  });

  const ticket = await prisma.ticket.create({
    data: ticketData,
  });

  return {
    data: ticket,
  };
}

interface TicketsQuery {
  type?: TicketType;
  status?: TicketStatus;
  sort: string;
  page: number;
  size: number;
}

// get tickets
async function getTickets(ticketsQuery: TicketsQuery) {
  const {
    type,
    status,
    sort,
    page,
    size,
  } = ticketsQuery;

  // order by
  const name = sort.startsWith('-')
    ? sort.substring(1)
    : sort;
  const direction = sort.startsWith('-')
    ? 'desc'
    : 'asc';

  const typeQuery = type
      ? {
        type,
      }
      : {};
  const statusQuery = status
      ? {
        status,
      }
      : {};

  const query = {
    ...typeQuery,
    ...statusQuery,
  };

  const count = await prisma.ticket.count({
    where: query,
  });

  const list = await prisma.ticket.findMany({
    where: query,
    orderBy: {
      [name]: direction,
    },
    skip: (page - 1) * size,
    take: size,
  });

  const data: Record<string, any> = {
    count,
    list,
  };

  // get post info
  const ids: Record<string, boolean> = {};
  for (const item of list) {
    if (item.ref
        && !ids[item.ref]) {
      ids[item.ref] = true;
    }
  }

  const postsData = await postModule.getPostsByIds(
    Object.keys(ids)
        .map((id) => Number(id))
  );
  const posts: Record<number, any> = {};
  if (postsData
      && postsData.data) {
    for (const post of postsData.data) {
      if (!posts[post.id]) {
        posts[post.id] = post;
      }
    }
  }

  data.posts = posts;

  return {
    data,
  };
}

interface UpdateData {
  status: string;
  message?: string;
}

async function updateTicket(ticketId: number, updateData: UpdateData) {
  const ticket = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      ...updateData,
      utime: new Date(),
    },
  });

  return {
    data: ticket,
  };
}

interface ReviewData {
  postId: number;
  action: 'approve' | 'reject',
  message?: string;
}

async function reviewPost(ticketId: number, reviewData: ReviewData) {
  const {
    postId,
    action,
    message,
  } = reviewData;

  const ticketStatusList = {
    approve: TicketStatusEnums.APPROVED,
    reject: TicketStatusEnums.REJECTED,
  };
  const postStatusList = {
    approve: PostStatusEnums.PUBLIC,
    reject: PostStatusEnums.REJECTED,
  };

  await updateTicket(ticketId, {
    status: ticketStatusList[action],
    message,
  });
  await postModule.updatePost(postId, {
    status: postStatusList[action],
  });

  return {};
}

// get tickets by ids
async function getTicketsByIds(ids: number[]) {
  const tickets = await prisma.ticket.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return {
    data: tickets,
  };
}

export default {
  createTicket,
  getTickets,
  updateTicket,
  reviewPost,
  getTicketsByIds,
};
