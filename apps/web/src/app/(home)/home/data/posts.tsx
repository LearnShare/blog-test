import React from 'react';
import Link from 'next/link';

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

function DataPosts() {
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>更新时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>文章标题</TableCell>
              <TableCell>2025-02-05</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>文章标题</TableCell>
              <TableCell>2025-02-05</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>文章标题</TableCell>
              <TableCell>2025-02-05</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DataPosts;
