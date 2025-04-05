import HTTP from '../../http';

export interface AccountsQuery {
  search?: string;
  role?: string;
  sort?: string;
  page?: number;
  size?: number;
}

function getAccounts(query: AccountsQuery) {
  return HTTP.get<any, any>('/account', {
    params: query,
  });
}

export default {
  getAccounts,
};
