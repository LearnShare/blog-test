'use client';

import React, {
  useState,
} from 'react';
import {
  useRequest,
} from 'ahooks';

import PostCard from '@/components/post/card';
import LoadMore from '@/components/load-more';

import type {
  Bookmark,
} from '@/types/bookmark';
import type {
  Account,
} from '@/types/account';
import {
  bookmark,
} from '@packages/lib/sdk/web';
import Empty from '@/components/empty';

const size = 12;

function Posts() {
  const [
    list,
    setList,
  ] = useState<Bookmark[]>([]);
  const [
    authors,
    setAuthors,
  ] = useState<Record<number, Account>>({});

  const [
    page,
    setPage,
  ] = useState(1);

  const {
    data,
    loading,
  } = useRequest(() => bookmark.getBookmarks({
    page,
    size,
  }), {
    refreshDeps: [
      page,
    ],
    onSuccess: (data) => {
      setList((oldList) => ([
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
    <section>
      <h2 className="text-xl my-4">我的收藏（{ data?.count || 0 }）</h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-6 *:flex-1 *:min-w-[400px] *:max-w-[calc(50%-12px)]">
          {
            list.map((item) => (
              <PostCard
                  key={ `${item.accountId}-${item.postId}` }
                  { ...item.post }
                  author={ authors[item.post.authorId] } />
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
    </section>
  );
}

export default Posts;
