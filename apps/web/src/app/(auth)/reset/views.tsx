'use client';

import React, {
  useState,
  Suspense,
} from 'react';
import Link from 'next/link';

import {
  buttonVariants,
} from '@/components/ui/button';
import ResetForm from './form';
import Loading from '@/components/loading';

type ViewType = 'reset' | 'success';

function ResetViews() {
  const [
    view,
    setView,
  ] = useState<ViewType>('reset');

  return (
    <>
      {
        view === 'reset' && (
          <Suspense
              fallback={
                <Loading loading />
              }>
            <ResetForm onSuccess={ () => setView('success') } />
          </Suspense>
        )
      }
      {
        view === 'success' && (
          <>
            <p className="mt-6 text-sm text-slate-500">密码已修改</p>
            <Link
                href="/sign-in"
                className={ buttonVariants({
                  variant: 'outline',
                  size: 'lg'
                }) }>继续登录</Link>
          </>
        )
      }
    </>
  );
}

export default ResetViews;
