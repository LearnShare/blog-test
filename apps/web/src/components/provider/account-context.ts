'use client';

import {
  createContext,
} from 'react';

export interface AccountContextType {
  notLogin: boolean;
  loading: boolean;
  loaded: boolean;
  info: any;
  setInfo: (data: any) => void;
}

const AccountContext = createContext<AccountContextType>({
  notLogin: true,
  loading: false,
  loaded: false,
  info: null,
  setInfo: () => {},
});

export default AccountContext;
