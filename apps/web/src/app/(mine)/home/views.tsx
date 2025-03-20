'use client';

import React, {
  useContext,
} from 'react';
import {
  NotebookPen as IconNotebookPen,
} from 'lucide-react';

import DataGrid from './data/grid';
import DataCharts from './data/charts';
import {
  Button,
} from '@/components/ui/button';

import AccountContext from '@/components/provider/account-context';
import {
  AuthorRoles,
} from '@/lib/config';

function HomeViews() {
  const {
    info,
  } = useContext(AccountContext);

  const author = info
      && AuthorRoles.includes(info.role);

  if (author) {
    return (
      <>
        <DataGrid />
        <DataCharts />
      </>
    );
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

export default HomeViews;
