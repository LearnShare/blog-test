'use client';

import React from 'react';
import {
  useRouter,
} from 'next/navigation';
import Link from 'next/link';

import {
  buttonVariants,
} from '@/components/ui/button';
import ProfileForm from '@/components/forms/profile';

import {
  cn,
} from '@/lib/utils';

function UpdateForm() {
  const router = useRouter();

  const onSuccess = () => {
    router.push('/home');
  };

  return (
    <div className="flex flex-col gap-3">
      <ProfileForm
          action="修改并继续"
          onSuccess={ () => onSuccess() } />
      <Link
          href="/home"
          className={ cn(
            buttonVariants({
              variant: 'outline',
              size: 'lg'
            }),
            'mt-6',
          ) }>跳过</Link>
      <div className="text-right text-xs text-slate-500">稍后可以在个人主页中修改</div>
    </div>
  );
}

export default UpdateForm;
