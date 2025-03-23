'use client';

import React, {
  useState,
} from 'react';
import {
  useRequest,
} from 'ahooks';

import PostCard from '@/components/post/card';
import LoadMore from '@/components/load-more';

import {
  post,
} from '@packages/lib/sdk/web';
import Empty from '@/components/empty';

const size = 12;

function Posts() {
  const [
    posts,
    setPosts,
  ] = useState([]);
  const [
    authors,
    setAuthors,
  ] = useState({});

  const [
    page,
    setPage,
  ] = useState(1);

  const {
    data,
    loading,
  } = useRequest(() => post.getPosts({
    page,
    size,
    account: 1,
  }), {
    refreshDeps: [
      page,
    ],
    onSuccess: (data) => {
      setPosts((oldList) => ([
        ...oldList,
        ...data.list,
      ]));
      setAuthors((oldValue) => ({
        ...oldValue,
        ...data.accounts,
      }));
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6 *:flex-1 *:min-w-[400px] *:max-w-[calc(50%-12px)]">
        {
          posts.map((post) => (
            <PostCard
                key={ post.id }
                { ...post }
                author={ authors[post.authorId] } />
          ))
        }
      </div>
      <LoadMore
          page={ page }
          size={ size }
          total={ data?.count }
          loading={ loading }
          onPageChange={ (p: number) => setPage(p) } />
      {
        !loading && !data?.count && (
          <Empty />
        )
      }
    </div>
  );
}

export default Posts;
