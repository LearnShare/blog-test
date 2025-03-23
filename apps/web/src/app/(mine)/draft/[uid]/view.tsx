'use client';

import React from 'react';
import {
  useRequest,
} from 'ahooks';

import PostDetail from '@/components/post/detail';
import Loading from '@/components/loading';
import Error from '@/components/error';

import {
  auth,
} from '@packages/lib/sdk/web';

function DraftView({
  uid,
}: {
  uid: string;
}) {
  const {
    data,
    loading,
    error,
  } = useRequest(() => auth.getPost(uid));

  return (
    <section className="flex-1">
      <Loading loading={ loading } />
      {
        !loading && error && (
          <Error message="找不到要访问的资源" />
        )
      }
      {
        !loading && data && (
          <PostDetail
              { ...data } />
        )
      }
    </section>
  );
}

export default DraftView;
