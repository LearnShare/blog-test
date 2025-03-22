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

import {
  post,
} from '@packages/lib/sdk/web';
import Loading from '@/components/loading';
import Empty from '@/components/empty';

function Posts() {
  const [
    filters,
    setFilters,
  ] = useState<Record<string, any>>({
    published: 1,
  });

  const [
    page,
    setPage,
  ] = useState(1);

  const {
    data,
    loading,
  } = useRequest(() => post.getPosts({
    mine: true,
    page,
    size: 10,
    ...filters,
  }), {
    refreshDeps: [
      page,
      filters,
    ],
  });

  return (
    <div className="flex flex-col gap-6">
      <Filter
          values={ filters }
          onChange={ (data: Record<string, any>) => setFilters(data) } />
      <Loading loading={ loading } />
      {
        !loading && data && (
          <>
            <div className="flex flex-wrap gap-6 *:flex-1 *:min-w-[400px] *:max-w-[calc(50%-12px)]">
              {
                data.list.map((post) => (
                  <PostCard
                      key={ post.id }
                      { ...post } />
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
