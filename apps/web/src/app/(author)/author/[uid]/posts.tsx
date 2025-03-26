'use client';

import React, {
  useState,
} from 'react';
import {
  useRequest,
} from 'ahooks';

import PostCard from '@/components/post/card';
import Pagination from '@/components/pagination';
import Loading from '@/components/loading';
import Empty from '@/components/empty';

import {
  post,
} from '@packages/lib/sdk/web';

function Posts({
  id,
}: {
  id: number;
}) {
  const [
    page,
    setPage,
  ] = useState(1);

  const {
    data,
    loading,
  } = useRequest(() => post.getPosts({
    author: id,
    page,
    size: 10,
  }), {
    refreshDeps: [
      page,
    ],
  });

  return (
    <section>
      <h2 className="text-xl my-4">最近更新</h2>
      <div className="flex flex-col gap-6">
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
    </section>
  );
}

export default Posts;
