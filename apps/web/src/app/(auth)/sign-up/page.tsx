import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Button,
  buttonVariants,
} from '@/components/ui/button';
import {
  Input,
} from '@/components/ui/input';

import AuthLayout from '@/components/page/auth';

export default function PageSignUp() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-center">注册</h2>
        <p className="text-sm text-gray-500 text-center">创建您的 BLOG 账号</p>
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
        <div className="
            my-4 flex gap-3 items-center text-sm text-slate-400
            before:content-['']
            before:border-b
            before:border-gray-300
            before:flex-1
            after:content-['']
            after:border-b
            after:border-gray-300
            after:flex-1">OR</div>
        <form className="flex flex-col gap-3">
          <div>
            <label
                htmlFor="email"
                className="block mb-1 text-sm">邮箱</label>
            <Input
                name="email"
                id="email" />
          </div>
          <div>
            <label
                htmlFor="password"
                className="block mb-1 text-sm">密码</label>
            <Input
                name="password"
                id="password"
                type="password" />
          </div>
          <Button
              className="mt-3"
              size="lg">注册</Button>
        </form>
        <div className="mt-4 text-right text-sm text-slate-500">
          <span>已拥有账号，</span>
          <Link
              href="/sign-in"
              className="underline text-slate-600">登录</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
