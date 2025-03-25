import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import PostActions from '@/components/post/actions';
import AuthorCard from '@/components/author';

import time from '@packages/lib/time';
import type {
  Post,
} from '@/types/post';

interface PostCardProps
    extends Post {
  actions?: boolean;
  onActionDone?: (action: string) => void;
}

export default function PostCard({
  id,
  uid,
  coverUrl,
  title,
  intro,
  published,
  utime,
  author,
  actions = false,
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
              published={ published }
              onActionDone={ onActionDone } />
        )
      }
      {
        utime && (
          <div className="text-xs text-gray-500">
            <time
                dateTime={ time.format(utime) }
                className="text-sm text-gray-500">{ time.format(utime) }</time>
          </div>
        )
      }
      <Link
          href={ `/${ published ? 'post' : 'draft' }/${uid}` }
          className="group flex flex-col gap-2">
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
      {
        author && (
          <AuthorCard
              { ...author } />
        )
      }
    </div>
  );
}
