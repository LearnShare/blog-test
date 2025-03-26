'use client';

import React from 'react';
import {
  useRequest,
} from 'ahooks';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">我的主页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/posts">全部文章</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>修改文章</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
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
