import React from 'react';

import AuthLayout from '@/components/page/auth';
import WelcomeForm from './form';

export default function PageWelcome() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-center">欢迎来到 BLOG</h2>
        <p className="text-sm text-gray-500 text-center">请输入邮箱中的激活代码</p>
        <WelcomeForm />
      </div>
    </AuthLayout>
  );
}
