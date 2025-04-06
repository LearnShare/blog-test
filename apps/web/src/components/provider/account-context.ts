'use client';

import {
  createContext,
} from 'react';

export interface AccountContextType {
  endNotLogin: boolean;
  notLogin: boolean;
  loading: boolean;
  loaded: boolean;
  info: any;
  setInfo: (data: any, token?: string) => void;
}

const AccountContext = createContext<AccountContextType>({
  endNotLogin: true,
  notLogin: true,
  loading: false,
  loaded: false,
  info: null,
  setInfo: () => {},
});

export default AccountContext;
