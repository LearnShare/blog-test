import prisma from '../prisma';
import postModule from './post';

interface TicketData {
  type: string;
  ref?: string;
  from?: number;
  to?: number;
  status: string;
}

// create ticket
async function createTicket(ticketData: TicketData) {
  try {
    const ticket = await prisma.ticket.create({
      data: ticketData,
    });

    return {
      data: ticket,
    };
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

interface TicketsQuery {
  type?: string;
  status?: string;
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

  // todo skip same type+ref
  try {
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
    const ids: Record<number, boolean> = {};
    for (const item of list) {
      if (!ids[item.ref]) {
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
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

export default {
  createTicket,
  getTickets,
};
