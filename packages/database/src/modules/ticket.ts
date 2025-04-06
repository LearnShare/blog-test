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
  const {
    type,
    ref,
    from,
  } = ticketData;

  try {
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
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

interface UpdateData {
  status: string;
  message?: string;
}

async function updateTicket(ticketId: number, updateData: UpdateData) {
  try {
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
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
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
    approve: 'approved',
    reject: 'rejected',
  };
  const postStatusList = {
    approve: 'public',
    reject: 'rejected',
  };

  try {
    await updateTicket(ticketId, {
      status: ticketStatusList[action],
      message,
    });
    await postModule.updatePost(postId, {
      status: postStatusList[action],
    });

    return {};
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
}

// get tickets by ids
async function getTicketsByIds(ids: number[]) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        OR: ids.map((id) => ({
          id,
        })),
      },
    });

    return {
      data: tickets,
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
  updateTicket,
  reviewPost,
  getTicketsByIds,
};
