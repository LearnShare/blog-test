'use client';

import React, {
  useContext,
} from 'react';
import Link from 'next/link';
import {
  NotebookPen as IconNotebookPen,
} from 'lucide-react';

import {
  buttonVariants,
} from '@/components/ui/button';

import AccountContext from '@/components/provider/account-context';
import {
  AuthorRoles,
} from '@/lib/config';

function AuthorCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    info,
    loaded,
  } = useContext(AccountContext);

  const author = loaded
      && info
      && AuthorRoles.includes(info.role);

  if (author) {
    return children;
  }

  if (loaded
      && !author) {
    return (
      <div className="mt-10 flex flex-col gap-6 items-center">
        <IconNotebookPen
            className="text-slate-300"
            size={ 64 }
            strokeWidth={ 1 } />
        <Link
            href="/about"
            className={ buttonVariants({
              size: 'lg'
            }) }>申请成为作者</Link>
      </div>
    );
  }
}

export default AuthorCheck;
