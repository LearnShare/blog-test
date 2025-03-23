import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  buttonVariants,
} from '@/components/ui/button';
import Divider from '@/components/divider';
import SignInForm from './form';

export default function PageSignIn() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl text-center">登录</h2>
      <p className="text-sm text-gray-500 text-center">开始撰写和分享</p>
      <div className="mt-6 flex flex-col gap-3">
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
      <Divider className="my-4">OR</Divider>
      <SignInForm />
      <div className="mt-4 text-right text-sm text-slate-500">
        <span>还没有账号，</span>
        <Link
            href="/sign-up"
            className="underline text-slate-600">注册</Link>
      </div>
    </div>
  );
}
