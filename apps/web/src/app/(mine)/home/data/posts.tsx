'use client';

import React from 'react';
import Link from 'next/link';
import {
  useRequest,
} from 'ahooks';

import {
  buttonVariants,
} from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import Loading from '@/components/loading';
import Empty from '@/components/empty';

import {
  post,
} from '@packages/lib/sdk/web';
import time from '@packages/lib/time';

function DataPosts() {
  const {
    data,
    loading,
  } = useRequest(() => post.getPosts({
    mine: 1,
    page: 1,
    size: 6,
  }));

  return (
    <div className="flex flex-col gap-3 flex-1 border rounded-lg border-gray-200 p-4 max-w-[calc((100%-24px)/2)]">
      <h3 className="text-sm text-slate-600 flex justify-between items-center">
        <span>最新文章</span>
        <Link
            href="/posts"
            className={ buttonVariants({
              variant: 'outline',
              size: 'sm',
            }) }>全部文章</Link>
      </h3>
      <div className="flex flex-col gap-2">
        <Loading loading={ loading } />
          {
            !loading && data && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标题</TableHead>
                    <TableHead>更新时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    data.list.map((post) => (
                      <TableRow
                          key={ post.id }>
                        <TableCell>{ post.title }</TableCell>
                        <TableCell>{ time.format(post.utime) }</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            )
          }
        {
          !loading && !data?.count && (
            <Empty />
          )
        }
      </div>
    </div>
  );
}

export default DataPosts;
