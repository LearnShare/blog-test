import React from 'react';

import AuthLayout from '@/components/page/auth';
import WelcomeViews from './views';

export default function PageWelcome() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-center">欢迎来到 BLOG</h2>
        <WelcomeViews />
      </div>
    </AuthLayout>
  );
}
