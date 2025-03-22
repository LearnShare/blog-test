import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import PostActions from '@/components/post/actions';

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
  cover,
  title,
  intro,
  published,
  utime,
  actions = false,
  onActionDone,
}: PostCardProps) {
  return (
    <div className="relative border rounded-lg border-gray-200 p-4">
      {
        actions && (
          <PostActions
              id={ id }
              uid={ uid }
              published={ published }
              onActionDone={ onActionDone } />
        )
      }
      {
        utime && (
          <div className="text-xs text-gray-500 mb-2">
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
          cover && (
            <div className="max-h-[300px] overflow-hidden flex justify-center">
              <Image
                  src={ cover }
                  width="471"
                  height="223"
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
    </div>
  );
}
