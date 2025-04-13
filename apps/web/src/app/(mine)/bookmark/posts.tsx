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
  Account,
  Bookmark,
  Post,
} from '@packages/database';
import {
  bookmark,
} from '@packages/sdk/web';
import Empty from '@/components/empty';

interface BookmarkWithPost
    extends Bookmark {
  post: Post;
}

const size = 12;

function Posts() {
  const [
    list,
    setList,
  ] = useState<BookmarkWithPost[]>([]);
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
    onSuccess: (data: {
      count: number;
      list: BookmarkWithPost[];
      accounts: Record<number, Account>;
    }) => {
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
        <div className="flex flex-wrap gap-6 *:w-full">
          {
            list.map((item: BookmarkWithPost) => (
              <PostCard
                  key={ `${item.accountId}-${item.postId}` }
                  { ...item.post }
                  author={ authors[item.post?.authorId] } />
            ))
          }
        </div>
        <LoadMore
            page={ page }
            size={ size }
            total={ data?.count || 0 }
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
