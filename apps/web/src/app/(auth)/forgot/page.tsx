import React from 'react';

import ForgotViews from './views';

export default function PageSignIn() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl text-center">重置密码</h2>
      <p className="text-sm text-gray-500 text-center">验证账号并重置密码</p>
      <ForgotViews />
    </div>
  );
}
