import React from 'react';

import AccountCard from '@/components/account/card';
import {
  Post,
} from '@/types/post';

import '@/css/markdown.scss';

export default function PostDetail({
  cover,
  title,
  content,
  author,
  utime,
}: Post) {
  return (
    <div className="flex flex-col gap-3">
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
            <AccountCard
                { ...author } />
          )
        }
        {
          utime && (
              <time
                  dateTime={ utime.toISOString() }
                  className="text-sm text-gray-500">{ utime.toISOString().substring(0, 10) }</time>
          )
        }
      </div>
      <div className="markdown-content">
        { content }
      </div>
    </div>
  );
}
