'use client';

import React, {
  useState,
} from 'react';
import {
  useRequest,
} from 'ahooks';
import Link from 'next/link';
import {
  MessageSquareText as IconMessageSquareText,
} from 'lucide-react';

import LoadMore from '@/components/load-more';
import Divider from '@/components/divider';

import {
  author,
} from '@packages/lib/sdk/web';
import Empty from '@/components/empty';
import AuthorCard from '@/components/author';
import type {
  Account,
} from '@/types/account';

const size = 12;

function Authors() {
  const [
    authors,
    setAuthors,
  ] = useState<Account[]>([]);

  const [
    page,
    setPage,
  ] = useState(1);

  const {
    data,
    loading,
  } = useRequest(() => author.getAuthors({
    posts: 1,
    page,
    size,
  }), {
    refreshDeps: [
      page,
    ],
    onSuccess: (data) => {
      setAuthors((oldList) => ([
        ...oldList,
        ...data.list,
      ]));
    },
  });

  return (
    <div className="flex flex-col">
      <h2 className="text-xl my-4">推荐作者</h2>
      <div className="flex flex-wrap gap-6">
        {
          authors.map((author) => (
            <Link
                key={ author.id }
                className="group border rounded-lg border-gray-200 p-4 flex flex-col flex-wrap gap-2 w-[calc((100%-48px)/3)]"
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
      <LoadMore
          className="mt-6"
          page={ page }
          size={ size }
          total={ data?.count }
          loading={ loading }
          onPageChange={ (p: number) => setPage(p) } />
      {
        !loading && !data?.count && (
          <Empty />
        )
      }
    </div>
  );
}

export default Authors;
