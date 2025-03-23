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

import AuthorCard from '@/components/author';
import {
  MarkdownRender,
} from '@/components/render';
import Divider from '@/components/divider';
import PostActions from '@/components/post/actions';
import Error from '@/components/error';
import Loading from '@/components/loading';
import {
  Badge,
} from '@/components/ui/badge';

import {
  Post,
} from '@/types/post';
import time from '@packages/lib/time';
import AccountContext from '@/components/provider/account-context';

export default function PostDetail({
  id,
  uid,
  cover,
  title,
  intro,
  content,
  format,
  published,
  author,
  utime,
}: Post) {
  const router = useRouter();

  const {
    info,
  } = useContext(AccountContext);

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

  if (!info) {
    return (
      <Loading />
    );
  }

  if (!published
      && info.id !== author.id) {
    return (
      <Error message="没有访问该页面的权限" />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {
        (info.id === author.id) && (
          <div className="flex justify-end items-center has-data-[slot=badge]:justify-between">
            {
              !published && (
                <Badge
                    variant="outline">未发布</Badge>
              )
            }
            <PostActions
                id={ id }
                uid={ uid }
                published={ published }
                onActionDone={ onActionDone } />
          </div>
        )
      }
      <div
          data-cover={ !!cover }
          className="
              group relative bg-no-repeat bg-top bg-cover
              data-[cover=true]:min-h-[300px]"
          style={ {
            backgroundImage: cover
              ? `url(${cover})`
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
