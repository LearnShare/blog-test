'use client';

import React, {
  useContext,
} from 'react';
import Link from 'next/link';
import {
  ShieldAlert as IconShieldAlert,
} from 'lucide-react';

import {
  buttonVariants,
} from '@/components/ui/button';

import AccountContext from '@/components/provider/account-context';

function AuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    info,
  } = useContext(AccountContext);

  if (info) {
    return children;
  }

  if (!info) {
    return (
      <div className="mt-10 flex flex-col gap-6 items-center">
        <IconShieldAlert
            className="text-slate-300"
            size={ 64 }
            strokeWidth={ 1 } />
        <span className="text-sm text-gray-500">该页面需要登录后访问</span>
        <Link
            href="/sign-in"
            className={ buttonVariants({
              variant: 'outline',
              size: 'lg'
            }) }>登录</Link>
      </div>
    );
  }
}

export default AuthCheck;
