'use client';

import React, {
  useContext,
} from 'react';
import Link from 'next/link';

import {
  buttonVariants,
} from '@/components/ui/button';

import AccountContext from '@/components/provider/account-context';

function HeaderActions() {
  const {
    info,
  } = useContext(AccountContext);

  return (
    <div className="flex gap-2 items-center">
      {
        !info && (
          <>
            <Link
                href="/sign-up"
                className={ buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                }) }>注册</Link>
            <Link
                href="/sign-in"
                className={ buttonVariants({
                  variant: 'default',
                  size: 'sm',
                }) }>登录</Link>
          </>
        )
      }
      {
        info && (
          <Link
              href={ `/@${info.uid}` }
              className="block py-1 text-md text-slate-700 hover:underline hover:text-slate-500">{ info.name } (@{ info.uid })</Link>
        )
      }
    </div>
  );
}

export default HeaderActions;
