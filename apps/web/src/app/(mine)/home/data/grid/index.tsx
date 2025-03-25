'use client';

import React from 'react';
import Link from 'next/link';
import {
  useRequest,
} from 'ahooks';
import {
  NotebookText as IconNotebookText,
  ChartNoAxesColumn as IconChartNoAxesColumn,
  BookHeart as IconBookHeart,
  PencilLine as IconPencilLine,
} from 'lucide-react';

import {
  buttonVariants,
} from '@/components/ui/button';
import DataItem from './item';

import {
  auth,
} from '@packages/lib/sdk/web';

function DataGrid() {
  const {
    data,
  } = useRequest(() => auth.accountStats());

  return (
    <div className="flex gap-6">
      <DataItem
          icon={ <IconNotebookText /> }
          label="公开文章"
          value={ data?.post?.published || 0 } />
      <DataItem
          icon={ <IconChartNoAxesColumn /> }
          label="阅读总计"
          value={ data?.post?.views || 0 } />
      <DataItem
          icon={ <IconBookHeart /> }
          label="收藏总计"
          value="-" />
      <div>
        <Link
            href="/write"
            className={ buttonVariants({
              variant: 'outline',
            }) }>
          <IconPencilLine />
          <span>编写文章</span>
        </Link>
      </div>
    </div>
  );
}

export default DataGrid;
