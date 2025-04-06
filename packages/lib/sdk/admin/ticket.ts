import HTTP from '../../http';

export interface TicketsQuery {
  type?: string;
  status?: string;
  sort?: string;
  page?: number;
  size?: number;
}

function getTickets(query: TicketsQuery) {
  return HTTP.get<any, any>('/ticket', {
    params: query,
  });
}

export default {
  getTickets,
};
