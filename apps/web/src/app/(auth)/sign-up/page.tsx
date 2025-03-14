import React from 'react';

import AuthLayout from '@/components/page/auth';
import SignUpViews from './views';

export default function PageSignUp() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <SignUpViews />
      </div>
    </AuthLayout>
  );
}
