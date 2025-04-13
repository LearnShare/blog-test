import HTTP from '../http';

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

interface ReviewData {
  type: string;
  postId: number;
  action: string;
  message?: string;
}

function reviewPost(id: number, reviewData: ReviewData) {
  return HTTP.put<any, any>(`/ticket/${id}`, reviewData);
}

export default {
  getTickets,
  reviewPost,
};
