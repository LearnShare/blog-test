import React from 'react';
import type { Metadata } from 'next';

import AuthorCheck from '../author-check';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import PostForm from '@/components/post/form';

export const metadata: Metadata = {
  title: '编写文章',
  description: '编写新文章',
};

export default function PageWrite() {
  return (
    <AuthorCheck>
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
          <BreadcrumbPage>编写文章</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <PostForm />
    </AuthorCheck>
  );
}
