import React from 'react';
import {
  BookOpenText as IconBookOpenText,
  BookCheck as IconBookCheck,
} from 'lucide-react';

import AccountCard from '@/components/account/card';
import {
  Post,
} from '@/types/post';
import time from '@packages/lib/time';
import {
  MarkdownRender,
} from '@/components/render';
import Divider from '@/components/divider';

export default function PostDetail({
  cover,
  title,
  intro,
  content,
  format,
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
