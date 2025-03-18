'use client';

import React, {
  useState,
} from 'react';

import ForgotForm from './form';

type ViewType = 'forgot' | 'sent';

function ForgotViews() {
  const [
    view,
    setView,
  ] = useState<ViewType>('forgot');

  return (
    <>
      {
        view === 'forgot' && (
          <ForgotForm onSuccess={ () => setView('sent') } />
        )
      }
      {
        view === 'sent' && (
          <p className="mt-6 text-center">重置链接已发送至您的邮箱</p>
        )
      }
    </>
  );
}

export default ForgotViews;
