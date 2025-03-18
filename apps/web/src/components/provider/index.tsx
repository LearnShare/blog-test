'use client';

import React, {
  useState,
  useEffect,
} from 'react';

import AccountContext from './account-context';
import {
  auth,
} from '@packages/lib/sdk/web';
import {
  useRequest,
} from '@/hooks';
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
    setToken(Store.getToken());
  }, []);

  const [
    info,
    setInfo,
  ] = useState(null);

  const {
    run: getInfo,
    loading,
    data: loaded,
    error,
  } = useRequest(auth.accountInfo, {
    auto: false,
    onSuccess: (res) => {
      setInfo(res);
    },
  });

  useEffect(() => {
    if (!info
        && !loaded
        && !loading
        && !error
        && token) {
      getInfo();
    }
  }, [
    info,
    loaded,
    loading,
    error,
    token,
    getInfo,
  ]);

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
