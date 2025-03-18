'use client';

import React, {
  useState,
} from 'react';

import VerifyForm from './verify-form';
import UpdateForm from './update-form';

type ViewType = 'verify' | 'update';

function WelcomeViews() {
  const [
    view,
    setView,
  ] = useState<ViewType>('verify');

  let message = '';
  switch (view) {
    case 'verify':
      message = '请输入邮箱中的激活代码';
      break;
    case 'update':
      message = '设置您的账号信息';
      break;
    default:
  }

  return (
    <>
      <p className="text-sm text-gray-500 text-center">{ message }</p>
      {
        view === 'verify' && (
          <VerifyForm onSuccess={ () => setView('update') } />
        )
      }
      {
        view === 'update' && (
          <UpdateForm />
        )
      }
    </>
  );
}

export default WelcomeViews;
