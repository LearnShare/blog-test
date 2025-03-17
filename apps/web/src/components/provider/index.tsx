'use client';

import React, {
  useState,
} from 'react';

import AccountContext from './account-context';

interface ProviderProps {
  children: React.ReactNode;
}

function Provider({
  children,
}: ProviderProps) {
  const [
    info,
    setInfo,
  ] = useState(null);

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
