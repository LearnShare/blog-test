import HTTP from '../http';

export interface AccountsQuery {
  search?: string;
  role?: string;
  disabled?: string;
  sort?: string;
  page?: number;
  size?: number;
}

function getAccounts(query: AccountsQuery) {
  return HTTP.get<any, any>('/account', {
    params: query,
  });
}

interface AccountUpdateData {
  disabled: boolean;
}

function updateAccount(id: number, data: AccountUpdateData) {
  return HTTP.put<any, any>(`/account/${id}`, data);
}

export default {
  getAccounts,
  updateAccount,
};
