'use client';

import React, {
  useContext,
  unstable_ViewTransition as ViewTransition,
} from 'react';
import {
  BookOpenText as IconBookOpenText,
  BookCheck as IconBookCheck,
} from 'lucide-react';
import {
  useRouter,
} from 'next/navigation';
import Image from 'next/image';
import {
  useRequest,
} from 'ahooks';

import AuthorCard from '@/components/author';
import {
  MarkdownRender,
} from '@/components/render';
import Divider from '@/components/divider';
import DetailActions from '@/components/post/actions/detail';
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
import Time from '@/components/time';

import {
  Post,
} from '@/types/post';
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
  status,
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

  if (status !== 'public'
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
                  variant="outline">{ status === 'public' ? '已发布' : '未发布' }</Badge>
              <DetailActions
                  id={ id }
                  uid={ uid }
                  onActionDone={ onActionDone } />
            </div>
          </>
        )
      }
      <div
          data-cover={ !!coverUrl }
          className="
              group relative bg-no-repeat bg-top bg-cover">
        {
          coverUrl && (
            <div className="group-data-[cover=true]:min-h-[300px] relative">
              <ViewTransition
                  name={ `post-cover-${id}` }>
                <Image
                    className="object-cover"
                    src={ coverUrl }
                    fill
                    alt="cover" />
              </ViewTransition>
            </div>
          )
        }
        <h3 className="
            text-2xl tracking-wider left-0 bottom-0 w-full
            group-data-[cover=true]:p-4
            group-data-[cover=true]:bg-black/25
            group-data-[cover=true]:backdrop-blur-sm
            group-data-[cover=true]:text-white
            group-data-[cover=true]:absolute">{ title }</h3>
      </div>
      <div className="flex justify-between items-center relative
          max-sm:pb-8">
        {
          author && (
            <ViewTransition
                name={ `post-author-${id}` }>
              <AuthorCard
                  { ...author } />
            </ViewTransition>
          )
        }
        {
          utime && (
            <Time
                value={ utime }
                className="absolute top-[50%] left-[50%] translate-[-50%]
                    max-sm:left-0 max-sm:bottom-1 max-sm:top-auto max-sm:translate-0" />
          )
        }
        <ViewTransition
            name={ `post-stats-${id}` }>
          <PostStats
              id={ id }
              views={ views }
              bookmarks={ bookmarks }
              bookmarked={ data?.bookmarked } />
        </ViewTransition>
      </div>
      {
        intro && (
          <div className="border border-gray-200 p-4 bg-gray-50">{ intro }</div>
        )
      }
      <Divider>
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
