import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  Post,
} from '@/types/post';

export default function PostCard({
  id,
  cover,
  title,
  content,
  utime,
}: Post) {
  return (
    <div className="border rounded-lg border-gray-200 p-4">
      {
        utime && (
          <div className="text-xs text-gray-500 mb-2">
            <time dateTime={ utime.toISOString() }>{ utime.toISOString().substring(0, 10) }</time>
          </div>
        )
      }
      <Link
          href={ `/post/${id}` }
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
          content && (
            <p className="text-sm text-gray-700">{ content }</p>
          )
        }
      </Link>
    </div>
  );
}
