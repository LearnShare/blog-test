'use client';

import React, {
  useContext,
} from 'react';
import {
  NotebookPen as IconNotebookPen,
} from 'lucide-react';

import {
  Button,
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
  } = useContext(AccountContext);

  const author = info
      && AuthorRoles.includes(info.role);

  if (author) {
    return children;
  }

  if (!author) {
    return (
      <div className="mt-10 flex flex-col gap-6 items-center">
        <IconNotebookPen
            className="text-slate-300"
            size={ 64 }
            strokeWidth={ 1 } />
        <Button
            variant="outline">申请成为作者</Button>
      </div>
    );
  }
}

export default AuthorCheck;
