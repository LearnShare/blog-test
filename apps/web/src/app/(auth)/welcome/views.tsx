'use client';

import React, {
  useState,
  useContext,
  useEffect,
} from 'react';

import VerifyForm from './verify-form';
import UpdateForm from './update-form';

import AccountContext from '@/components/provider/account-context';

type ViewType = 'verify' | 'update';

function WelcomeViews() {
  const {
    info,
  } = useContext(AccountContext);

  const [
    view,
    setView,
  ] = useState<ViewType>('verify');
  useEffect(() => {
    setView(info?.verified ? 'update' : 'verify');
  }, [
    info,
  ]);

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

  if (!info) {
    return;
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
