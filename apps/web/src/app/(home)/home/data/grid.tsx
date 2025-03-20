'use client';

import React, {
  useContext,
} from 'react';

import {
  NotebookText as IconNotebookText,
  ChartNoAxesColumn as IconChartNoAxesColumn,
  BookHeart as IconBookHeart,
  Handshake as IconHandshake,
  PencilLine as IconPencilLine,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';
import DataItem from './item';

import AccountContext from '@/components/provider/account-context';
import {
  AuthorRoles,
} from '@/lib/config';

function DataGrid() {
  const {
    info,
  } = useContext(AccountContext);

  const author = info
      && AuthorRoles.includes(info.role);

  return (
    <div className="flex gap-6">
      <DataItem
          icon={ <IconNotebookText /> }
          label="公开文章"
          value="1234" />
      <DataItem
          icon={ <IconChartNoAxesColumn /> }
          label="阅读统计"
          value="1234" />
      <DataItem
          icon={ <IconBookHeart /> }
          label="读者收藏"
          value="1234" />
      <div>
        {
          !author && (
            <Button
                variant="outline">
              <IconHandshake />
              <span>成为作者</span>
            </Button>
          )
        }
        {
          author && (
            <Button
                variant="outline">
              <IconPencilLine />
              <span>编写文章</span>
            </Button>
          )
        }
      </div>
    </div>
  );
}

export default DataGrid;
