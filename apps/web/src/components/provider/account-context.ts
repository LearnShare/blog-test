'use client';

import {
  createContext,
} from 'react';

import type {
  Account,
} from '@packages/database';

export interface AccountContextType {
  endNotLogin: boolean;
  notLogin: boolean;
  loading: boolean;
  loaded: boolean;
  info?: Account;
  setInfo: (data: any, token?: string) => void;
}

const AccountContext = createContext<AccountContextType>({
  endNotLogin: true,
  notLogin: true,
  loading: false,
  loaded: false,
  info: undefined,
  setInfo: () => {},
});

export default AccountContext;
