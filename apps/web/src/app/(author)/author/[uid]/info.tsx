import React from 'react';

import AuthorCard from '@/components/author';
import PostStats from '@/components/post/stats';
import type {
  Account,
} from '@packages/database';

interface AccountWithPostStats
    extends Account {
  postStats?: {
    views?: number;
    bookmarks?: number;
  };
}

function AuthorInfo({
  data,
}: {
  data: AccountWithPostStats;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        {
          data && (
            <AuthorCard
                { ...data } />
          )
        }
        <PostStats
            views={ data?.postStats?.views || 0 }
            bookmarks={ data?.postStats?.bookmarks || 0 } />
      </div>
      {
        data?.intro && (
          <div className="border border-gray-200 p-4 bg-gray-50">{ data?.intro }</div>
        )
      }
    </div>
  );
}

export default AuthorInfo;
