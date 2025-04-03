'use client';

import React, {
  useState,
  useEffect,
} from 'react';
import {
  useRequest,
} from 'ahooks';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import AccountContext from './account-context';
import {
  auth,
} from '@packages/lib/sdk/web';
import Store from '@/lib/store';
import AuthRequired from '@/components/error/auth-required';

const welcomePath = '/welcome';
const privatePaths = [
  '/welcome',
  '/bookmark',
  '/draft/',
  '/edit/',
  '/home',
  '/posts',
  '/write/',
];

function isPrivate(path: string) {
  for (const p of privatePaths) {
    if (path.startsWith(p)) {
      return true;
    }
  }

  return false;
}

interface ProviderProps {
  children: React.ReactNode;
}

function Provider({
  children,
}: ProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [
    token,
    setToken,
  ] = useState('');
  const [
    mounted,
    setMounted,
  ] = useState(false);
  useEffect(() => {
    setToken(Store.getToken() || '');
    setMounted(true);
  }, []);

  const [
    info,
    setInfo,
  ] = useState(null);
  const [
    loaded,
    setLoaded,
  ] = useState(false);

  const {
    loading,
  } = useRequest(auth.accountInfo, {
    ready: !!token,
    onSuccess: (res) => {
      setInfo(res);

      // redirect if !verified
      if (!res.verified
          && pathname !== welcomePath) {
        router.push(welcomePath);
      }
    },
    onFinally: () => {
      setLoaded(true);
    },
  });

  const notLogin = (mounted && !token)
      || (loaded && !info);

  const contextValue = {
    notLogin,
    loading,
    loaded,
    info,
    setInfo: (data: any) => {
      setLoaded(true);
      setInfo(data);
    },
  };

  let content = children;

  // check is private path
  if (notLogin
      && isPrivate(pathname)) {
    content = (
        <AuthRequired />
    );
  }

  return (
    <AccountContext value={ contextValue }>
      { content }
    </AccountContext>
  );
}

export default Provider;
