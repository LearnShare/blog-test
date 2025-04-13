'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquareText as IconMessageSquareText,
} from 'lucide-react';

import SimplePagination from '@/components/pagination/simple';
import Divider from '@/components/divider';

import Empty from '@/components/empty';
import AuthorCard from '@/components/author';
import type {
  Account,
} from '@packages/database';

interface AuthorWithPostsCount
    extends Account {
  postsCount?: number;
}

interface AuthorsProps {
  count?: number;
  list?: AuthorWithPostsCount[];
  page?: number;
  size?: number;
}

function Authors({
  count = 0,
  list = [],
  page = 1,
  size = 12
}: AuthorsProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl my-4">推荐作者</h2>
      <div className="flex flex-wrap gap-6">
        {
          list.map((author: AuthorWithPostsCount) => (
            <Link
                key={ author.id }
                className="group border rounded-lg border-gray-200 p-4
                    flex flex-col flex-wrap gap-2
                    w-full sm:w-[calc((50%-12px))] lg:w-[calc((100%-48px)/3)]"
                href={ `/author/@${author.uid}` }>
              <div className="flex items-center justify-between">
                <AuthorCard
                    link={ false }
                    uid={ author.uid }
                    name={ author.name }
                    avatarUrl={ author.avatarUrl } />
                <div className="text-slate-500">文章: { author.postsCount }</div>
              </div>
              {
                author.intro && (
                  <>
                    <Divider>
                      <IconMessageSquareText size={ 20 } />
                    </Divider>
                    <p className="text-sm text-gray-600">{ author.intro }</p>
                  </>
                )
              }
            </Link>
          ))
        }
      </div>
      <SimplePagination
          className="mt-6"
          page={ page }
          size={ size }
          total={ count } />
      {
        !count && (
          <Empty />
        )
      }
    </div>
  );
}

export default Authors;
