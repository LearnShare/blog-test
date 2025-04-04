import React from 'react';

import SignInForm from './form';

export default function PageSignIn() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl text-center">登录</h2>
      <p className="text-sm text-gray-500 text-center">请登录您的管理员账号</p>
      <SignInForm />
    </div>
  );
}
