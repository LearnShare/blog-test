'use client';

import React from 'react';
import Link from 'next/link';
import {
  useRequest,
} from 'ahooks';

import AuthorCheck from '../../../author-check';
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
  PostStatusNames,
} from '@packages/types';
import type {
  Post,
} from '@packages/database';
import {
  PostStatusEnums,
} from '@packages/types';
import {
  auth,
} from '@packages/sdk/web';
import time from '@packages/lib/time';

function DataPosts() {
  const {
    data,
    loading,
  } = useRequest(() => auth.getPosts({
    page: 1,
    size: 6,
    status: PostStatusEnums.PUBLIC,
  }));

  return (
    <div className="flex flex-col gap-3 flex-1 border rounded-lg border-gray-200 p-4">
      <AuthorCheck>
        <h3 className="text-sm text-slate-600 flex justify-between items-center">
          <span>最近发布</span>
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
              !loading && data?.count > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>标题</TableHead>
                      <TableHead>更新时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>阅读</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      data.list.map((post: Post) => (
                        <TableRow
                            key={ post.id }>
                          <TableCell>
                            <Link
                                className="hover:underline"
                                href={ `/${post.status === PostStatusEnums.PUBLIC ? 'post' : 'draft'}/${post.uid}` }
                                target="_blank">{ post.title }</Link>
                          </TableCell>
                          <TableCell>{ post.utime ? time.formatRelative(post.utime) : '-' }</TableCell>
                          <TableCell>{ PostStatusNames[post.status] }</TableCell>
                          <TableCell>{ post.views }</TableCell>
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
      </AuthorCheck>
    </div>
  );
}

export default DataPosts;
