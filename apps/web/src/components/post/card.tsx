import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import PostActions from './actions/detail';
import AuthorCard from '@/components/author';
import PostStats from './stats';
import Divider from '@/components/divider';
import Time from '@/components/time';

import type {
  Post,
} from '@/types/post';

interface PostCardProps
    extends Post {
  actions?: boolean;
  message?: string;
  onActionDone?: (action: string) => void;
}

export default function PostCard({
  id,
  uid,
  coverUrl,
  title,
  intro,
  utime,
  author,
  views,
  bookmarks,
  bookmarked,
  actions = false,
  status,
  message,
  onActionDone,
}: PostCardProps) {
  return (
    <div className="relative border rounded-lg border-gray-200 p-4 flex flex-col gap-4">
      {
        actions && (
          <PostActions
              className="absolute right-1 top-1"
              id={ id }
              uid={ uid }
              onActionDone={ onActionDone } />
        )
      }
      {
        utime && (
          <div className="text-xs text-gray-500">
            <Time value={ utime } />
          </div>
        )
      }
      <Link
          href={ `/${ status === 'public' ? 'post' : 'draft' }/${uid}` }
          className="flex-1 group flex flex-col gap-2">
        {
          coverUrl && (
            <div className="h-[160px] overflow-hidden flex justify-center relative">
              <Image
                  src={ coverUrl }
                  fill
                  objectFit="cover"
                  alt={ title } />
            </div>
          )
        }
        <h3 className="group-hover:underline text-xl">{ title }</h3>
        {
          intro && (
            <p className="text-sm text-gray-700">{ intro }</p>
          )
        }
      </Link>
      <div className="flex items-center justify-end has-[>a]:justify-between">
        {
          author && (
            <AuthorCard
                className="max-w-[50%]"
                { ...author } />
          )
        }
        <PostStats
            id={ id }
            views={ views }
            bookmarks={ bookmarks }
            bookmarked={ bookmarked } />
      </div>
      {
        message && (
          <>
            <Divider>审核意见</Divider>
            <p className="text-sm text-slate-800">{ message }</p>
          </>
        )
      }
    </div>
  );
}
