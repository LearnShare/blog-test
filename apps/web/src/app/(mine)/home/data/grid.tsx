import React from 'react';
import Link from 'next/link';
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

function DataGrid() {
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
        <Link
            href="/write"
            className={ buttonVariants({
              variant: 'outline',
              size: 'sm',
            }) }>
          <IconPencilLine />
          <span>编写文章</span>
        </Link>
      </div>
    </div>
  );
}

export default DataGrid;
