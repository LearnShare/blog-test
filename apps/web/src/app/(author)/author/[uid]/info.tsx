import React from 'react';

import AuthorCard from '@/components/author';
import PostStats from '@/components/post/stats';

function AuthorInfo({
  data,
}: {
  data: any;
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
            views={ data?.postStats?.views } />
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
