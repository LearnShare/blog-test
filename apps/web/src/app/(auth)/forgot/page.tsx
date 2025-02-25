import React from 'react';
import Link from 'next/link';
import {
  Button,
} from '@/components/ui/button';
import {
  Input,
} from '@/components/ui/input';

import AuthLayout from '@/components/page/auth';

export default function PageSignIn() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-center">重置密码</h2>
        <p className="text-sm text-gray-500 text-center">验证账号并重置密码</p>
        <form className="mt-8 flex flex-col gap-3">
          <div>
            <label
                htmlFor="email"
                className="block mb-1 text-sm">邮箱</label>
            <Input
                name="email"
                id="email" />
          </div>
          <Button
              className="mt-3"
              size="lg">继续</Button>
        </form>
        <div className="mt-4 text-right text-sm text-slate-500">
          <span>忘记账号，</span>
          <Link
              href="/hi"
              className="underline text-slate-600">联系管理员</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
