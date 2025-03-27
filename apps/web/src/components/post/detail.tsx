'use client';

import React, {
  useContext,
} from 'react';
import {
  BookOpenText as IconBookOpenText,
  BookCheck as IconBookCheck,
} from 'lucide-react';
import {
  useRouter,
} from 'next/navigation';
import {
  useRequest,
} from 'ahooks';

import AuthorCard from '@/components/author';
import {
  MarkdownRender,
} from '@/components/render';
import Divider from '@/components/divider';
import PostActions from '@/components/post/actions';
import Error from '@/components/error';
import {
  Badge,
} from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import PostStats from './stats';

import {
  Post,
} from '@/types/post';
import time from '@packages/lib/time';
import AccountContext from '@/components/provider/account-context';
import {
  bookmark,
} from '@packages/lib/sdk/web';

export default function PostDetail({
  id,
  uid,
  coverUrl,
  title,
  intro,
  content,
  format,
  published,
  author,
  views,
  bookmarks,
  utime,
}: Post) {
  const router = useRouter();

  const {
    info,
  } = useContext(AccountContext);

  const {
    data,
  } = useRequest(() => bookmark.check(id),
    {
      ready: !!info?.id,
    },
  );

  const onActionDone = (action: string) => {
    switch (action) {
      case 'publish':
        router.push(`/post/${uid}`);
        return;
      case 'withdraw':
        router.push(`/draft/${uid}`);
        return;
      case 'delete':
        router.push('/posts');
        return;
      default:
    }
  };

  if (!published
      && info?.id !== author.id) {
    return (
      <Error message="没有访问该页面的权限" />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {
        (info?.id === author.id) && (
          <>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/home">我的主页</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/posts">全部文章</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>文章详情</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-between">
              <Badge
                  variant="outline">{ published ? '已发布' : '未发布' }</Badge>
              <PostActions
                  id={ id }
                  uid={ uid }
                  published={ published }
                  onActionDone={ onActionDone } />
            </div>
          </>
        )
      }
      <div
          data-cover={ !!coverUrl }
          className="
              group relative bg-no-repeat bg-top bg-cover
              data-[cover=true]:min-h-[300px]"
          style={ {
            backgroundImage: coverUrl
              ? `url(${coverUrl})`
              : '',
          } }>
        <h3 className="
            text-2xl tracking-wider left-0 bottom-0 w-full
            group-data-[cover=true]:p-4
            group-data-[cover=true]:bg-black/25
            group-data-[cover=true]:backdrop-blur-sm
            group-data-[cover=true]:text-white
            group-data-[cover=true]:absolute">{ title }</h3>
      </div>
      <div className="flex justify-between items-center">
        {
          author && (
            <AuthorCard
                { ...author } />
          )
        }
        {
          utime && (
            <time
                dateTime={ time.format(utime) }
                className="text-sm text-gray-500">{ time.format(utime) }</time>
          )
        }
        <PostStats
            id={ id }
            views={ views }
            bookmarks={ bookmarks }
            bookmarked={ data?.bookmarked } />
      </div>
      {
        intro && (
          <div className="border border-gray-200 p-4 bg-gray-50">{ intro }</div>
        )
      }
      <Divider className="my-3">
        <IconBookOpenText />
      </Divider>
      <div>
        {
          format === 'MARKDOWN' && (
            <MarkdownRender
                content={ content } />
          )
        }
        <Divider className="my-10">
          <IconBookCheck />
        </Divider>
      </div>
    </div>
  );
}
