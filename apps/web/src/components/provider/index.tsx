'use client';

import React, {
  useState,
  useEffect,
} from 'react';
import {
  useRequest,
} from 'ahooks';

import AccountContext from './account-context';
import {
  auth,
} from '@packages/lib/sdk/web';
import Store from '@/lib/store';

interface ProviderProps {
  children: React.ReactNode;
}

function Provider({
  children,
}: ProviderProps) {
  const [
    token,
    setToken,
  ] = useState('');
  useEffect(() => {
    setToken(Store.getToken() || '');
  }, []);

  const [
    info,
    setInfo,
  ] = useState(null);

  const {} = useRequest(auth.accountInfo, {
    ready: !!token,
    onSuccess: (res) => {
      setInfo(res);
    },
  });

  const contextValue = {
    info,
    setInfo,
  };

  return (
    <AccountContext value={ contextValue }>
      { children }
    </AccountContext>
  );
}

export default Provider;
