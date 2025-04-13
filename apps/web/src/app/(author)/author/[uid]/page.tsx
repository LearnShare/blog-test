import type { Metadata } from 'next';
import React, {
  cache,
} from 'react';

import AuthorInfo from './info';
import AuthorPosts from './posts';

import type {
  Account,
  Post,
} from '@packages/database';
import {
  post,
  author,
} from '@packages/sdk/web';

const getAuthor: (uid: string) => Promise<Account>
    = cache(async (uid: string) => await author.getAuthor(uid));

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    uid: string;
  }>
}): Promise<Metadata> {
  const {
    uid,
  } = await params;

  const realUid = decodeURIComponent(uid).substring(1);

  const data: Account = await getAuthor(realUid);

  return {
    title: data
        ? `${data.name} | 作者`
        : '',
    description: data?.intro,
    authors: [
      {
        name: data?.name,
        url: `/author/@${realUid}`,
      },
    ],
  };
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
  params: Promise<{
    uid: string;
  }>,
}

const size = 12;

export default async function PageAuthor({
  searchParams,
  params,
}: PageProps) {
  const {
    uid,
  } = await params;
  const {
    page = '1',
  } = await searchParams;

  const realUid = decodeURIComponent(uid).substring(1);

  const data: Account = await getAuthor(realUid);

  const postData: {
    count: number;
    list: Post[];
  } = await post.getPosts({
    page: Number(page),
    size,
    sort: '-utime',
    author: data.id,
  });

  return (
    <div>
      <AuthorInfo data={ data } />
      <AuthorPosts
          { ...postData }
          page={ Number(page) }
          size={ size } />
    </div>
  );
}
