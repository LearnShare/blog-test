'use client';

import React, {
  // useContext,
} from 'react';
// import Link from 'next/link';
import {
  useRequest,
} from 'ahooks';
import {
  NotebookText as IconNotebookText,
  ChartNoAxesColumn as IconChartNoAxesColumn,
  BookHeart as IconBookHeart,
  // PencilLine as IconPencilLine,
} from 'lucide-react';

// import {
//   buttonVariants,
// } from '@/components/ui/button';
import DataItem from './item';

import {
  auth,
} from '@packages/lib/sdk/web';
// import AccountContext from '@/components/provider/account-context';
// import {
//   AuthorRoles,
// } from '@/lib/config';

function DataGrid() {
  // const {
  //   info,
  // } = useContext(AccountContext);

  const {
    data,
  } = useRequest(() => auth.accountStats());

  // const author = info
  //     && AuthorRoles.includes(info.role);

  return (
    <div className="flex gap-6
        max-xs:gap-3">
      <DataItem
          icon={ <IconNotebookText /> }
          label="公开文章"
          value={ data?.post?.published || 0 } />
      <DataItem
          icon={ <IconChartNoAxesColumn /> }
          label="被阅读数"
          value={ data?.post?.views || 0 } />
      <DataItem
          icon={ <IconBookHeart /> }
          label="被收藏数"
          value={ data?.post?.bookmarks || 0 } />
      {/* {
        author && (
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
        )
      } */}
    </div>
  );
}

export default DataGrid;
