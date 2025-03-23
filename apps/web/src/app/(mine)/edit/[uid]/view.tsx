'use client';

import React from 'react';
import {
  useRequest,
} from 'ahooks';

import PostForm from '@/components/post/form';
import Loading from '@/components/loading';
import Error from '@/components/error';

import {
  auth,
} from '@packages/lib/sdk/web';

function EditView({
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
    <>
      <Loading loading={ loading } />
      {
        !loading && error && (
          <Error message="找不到要访问的资源" />
        )
      }
      {
        !loading && data && (
          <PostForm
              { ...data } />
        )
      }
    </>
  );
}

export default EditView;
