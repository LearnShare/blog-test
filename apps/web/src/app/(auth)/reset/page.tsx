import React from 'react';

import ResetViews from './views';

export default function PageSignIn() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl text-center">设置新密码</h2>
      <p className="text-sm text-gray-500 text-center">请牢记并妥善保存您的新密码</p>
      <ResetViews />
    </div>
  );
}
