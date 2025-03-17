import {
  createContext,
} from 'react';

export interface AccountContextType {
  info: any;
  setInfo: (data: any) => void;
}

const AccountContext = createContext<AccountContextType>({
  info: null,
  setInfo: () => {},
});

export default AccountContext;
