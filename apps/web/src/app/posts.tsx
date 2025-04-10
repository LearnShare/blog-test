'use client';

import React, {
  useContext,
} from 'react';
import {
  useRequest,
} from 'ahooks';

import PostCard from '@/components/post/card';
import Empty from '@/components/empty';
import SimplePagination from '@/components/pagination/simple';

import AccountContext from '@/components/provider/account-context';
import type {
  Post,
} from '@/types/post';
import type {
  Account,
} from '@/types/account';
import {
  bookmark,
} from '@packages/lib/sdk/web';

interface PostsProps {
  count?: number;
  list?: Post[];
  accounts?: Record<number, Account>;
  page?: number;
  size?: number;
}

function Posts({
  count = 0,
  list = [],
  accounts = {},
  page = 1,
  size = 12
}: PostsProps) {
  const {
    info,
  } = useContext(AccountContext);

  const postIds = list.map((post: Post) => post.id);

  const {
    data = {},
  } = useRequest(() =>
      bookmark.getBookmarkd({
        ids: postIds,
      }),
    {
      ready: info
          && postIds.length,
    },
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6
          *:w-full">
        {
          list.map((post: Post) => (
            <PostCard
                key={ post.id }
                { ...post }
                bookmarked={ data[post.id] }
                author={ accounts[post.authorId] } />
          ))
        }
      </div>
      <SimplePagination
          page={ page }
          size={ size }
          total={ count } />
      {
        !count && (
          <Empty />
        )
      }
    </div>
  );
}

export default Posts;
