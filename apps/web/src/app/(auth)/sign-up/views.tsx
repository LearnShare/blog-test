'use client';

import React, {
  useState,
} from 'react';
import Link from 'next/link';
// import Image from 'next/image';

import {
  buttonVariants,
} from '@/components/ui/button';
// import Divider from '@/components/divider';
import SignUpForm from './form';
import { cn } from '@/lib/utils';

type ViewType = 'form' | 'success';

function SignUpViews() {
  const [
    view,
    setView,
  ] = useState<ViewType>('form');

  if (view === 'form') {
    return (
      <>
        <h2 className="text-3xl text-center">注册</h2>
        <p className="text-sm text-gray-500 text-center">创建您的 BLOG 账号</p>
        {/* <div className="mt-6 flex flex-col gap-3">
          <Link
              href="/sign-up"
              className={ buttonVariants({
                variant: 'outline',
                size: 'lg'
              }) }>
            <Image
                src="/icons/google.svg"
                width="24"
                height="24"
                alt="google" />
            <span className="w-[146px]">使用 Google 账号登录</span>
          </Link>
          <Link
              href="/sign-up"
              className={ buttonVariants({
                variant: 'outline',
                size: 'lg'
              }) }>
            <Image
                src="/icons/apple.svg"
                width="22"
                height="22"
                alt="apple" />
            <span className="w-[146px]">使用 Apple 账号登录</span>
          </Link>
        </div>
        <Divider className="my-4">OR</Divider> */}
        <SignUpForm
            onSuccess={ () => setView('success') } />
        <div className="mt-4 text-right text-sm text-slate-500">
          <span>已拥有账号，</span>
          <Link
              href="/sign-in"
              className="underline text-slate-600">登录</Link>
        </div>
      </>
    );
  }

  if (view === 'success') {
    return (
      <>
        <h2 className="text-3xl text-center">🎉 注册成功 🎉</h2>
        <p className="mt-4 text-sm text-gray-500 text-center">激活代码已发送至您的邮箱<br />请登录并激活您的账号</p>
        <Link
            href="/sign-in"
            className={ cn(
              'mt-8',
              buttonVariants({
                variant: 'default',
                size: 'lg'
              })
            ) }>登录</Link>
      </>
    );
  }

  return null;
}

export default SignUpViews;
