'use client';

import React, {
  useState,
} from 'react';
import {
  useRequest,
} from 'ahooks';

import PostCard from '@/components/post/card';

import {
  post,
} from '@packages/lib/sdk/web';
import Pagination from '@/components/pagination';

function Posts() {
  const [
    page,
    setPage,
  ] = useState(1);

  const {
    data,
  } = useRequest(() => post.getPosts({
    mine: true,
    page,
    size: 10,
  }), {
    refreshDeps: [
      page,
    ],
  });

  return (
    <>
      <div className="flex flex-wrap gap-6 *:flex-1 *:min-w-[400px] *:max-w-[calc(50%-12px)]">
        {
          data?.list.map((post) => (
            <PostCard
                key={ post.id }
                { ...post } />
          ))
        }
      </div>
      <Pagination
          page={ page }
          total={ data?.count }
          onPageChange={ (p: number) => setPage(p) } />
    </>
  );
}

export default Posts;
