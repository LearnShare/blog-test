'use client';

import React, {
  useState,
} from 'react';
import {
  useRequest,
} from 'ahooks';

import PostCard from '@/components/post/card';
import Filter from './filter';
import Pagination from '@/components/pagination';
import Loading from '@/components/loading';
import Empty from '@/components/empty';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import type {
  Post,
} from '@packages/database';
import {
  auth,
} from '@packages/sdk/web';
import {
  PostStatusEnums,
} from '@packages/types';

function Posts() {
  const [
    filters,
    setFilters,
  ] = useState<Record<string, any>>({
    status: PostStatusEnums.PUBLIC,
  });

  const [
    page,
    setPage,
  ] = useState(1);

  const {
    data,
    loading,
    refresh,
  } = useRequest(() => auth.getPosts({
    page,
    size: 10,
    sort: '-ctime',
    ...filters,
  }), {
    refreshDeps: [
      page,
      filters,
    ],
  });

  const {
    data: stats,
    refresh: refreshStats,
  } = useRequest(() => auth.accountStats());

  const onActionDone = () => {
    refresh();
    refreshStats();
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">我的主页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>全部文章</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <Filter
          stats={ stats?.post }
          values={ filters }
          onChange={ (data: Record<string, any>) => setFilters(data) } />
      <Loading loading={ loading } />
      {
        !loading && data && (
          <>
            <div className="flex flex-wrap gap-6 *:w-full">
              {
                data.list.map((post: Post) => (
                  <PostCard
                      key={ post.id }
                      { ...post }
                      actions
                      message={ data?.tickets
                          && post.ticket
                          && data?.tickets[post.ticket]?.message }
                      onActionDone={ () => onActionDone() } />
                ))
              }
            </div>
            <Pagination
                className="mb-6"
                page={ page }
                total={ data.count }
                onPageChange={ (p: number) => setPage(p) } />
            {
              !data.count && (
                <Empty />
              )
            }
          </>
        )
      }
    </div>
  );
}

export default Posts;
