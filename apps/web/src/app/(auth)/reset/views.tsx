'use client';

import React, {
  useState,
} from 'react';
import Link from 'next/link';

import {
  buttonVariants,
} from '@/components/ui/button';
import ResetForm from './form';

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
          <ResetForm onSuccess={ () => setView('success') } />
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
