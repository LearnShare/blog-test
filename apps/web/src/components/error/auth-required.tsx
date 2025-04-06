import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert as IconShieldAlert,
} from 'lucide-react';

import {
  buttonVariants,
} from '@/components/ui/button';
import HomeLayout from '@/components/page/home';

function AuthRequired() {
  return (
    <HomeLayout>
      <div className="mt-10 flex flex-col gap-6 items-center">
        <IconShieldAlert
            className="text-slate-300"
            size={ 64 }
            strokeWidth={ 1 } />
        <span className="text-sm text-gray-500">该页面需要您登录后访问</span>
        <Link
            href="/sign-in"
            className={ buttonVariants({
              size: 'lg'
            }) }>登录</Link>
      </div>
    </HomeLayout>
  );
}

export default AuthRequired;
