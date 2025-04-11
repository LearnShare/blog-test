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
    <div className="border rounded-lg border-gray-200 flex flex-row-reverse overflow-hidden relative
        max-md:flex-col">
      {
        actions && (
          <PostActions
              className="absolute right-1 top-1 z-20 backdrop-blur-sm bg-white/40"
              id={ id }
              uid={ uid }
              onActionDone={ onActionDone } />
        )
      }
      {
        coverUrl && (
          <Link
              className="h-full w-[50%] max-w-[300px] overflow-hidden relative
                  max-md:h-[240px] max-md:w-full max-md:max-w-none  max-md:max-h-none"
              href={ `/${ status === 'public' ? 'post' : 'draft' }/${uid}` }>
            <Image
                className="object-cover hover:scale-110 ease-out duration-500"
                src={ coverUrl }
                fill
                alt={ title } />
          </Link>
        )
      }
      <div className="flex-1 min-h-[140px] p-4 flex flex-col gap-2 justify-between">
        <Link
            href={ `/${ status === 'public' ? 'post' : 'draft' }/${uid}` }
            className="group flex flex-col gap-2">
          <h3 className="flex-1 group-hover:underline text-xl">{ title }</h3>
          {
            intro && (
              <p className="text-sm text-gray-700">{ intro }</p>
            )
          }
        </Link>
        {
          author && (
            <AuthorCard
                className="mt-6 max-w-[300px]"
                { ...author } />
          )
        }
        <div className="flex items-center justify-between">
          {
            utime && (
              <div className="text-xs text-gray-500">
                <Time value={ utime } />
              </div>
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
    </div>
  );
}
