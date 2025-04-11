import type { Metadata } from 'next';

import Authors from './authors';
import type {
  Account,
} from '@/types/account';
import {
  author,
} from '@packages/lib/sdk/web';

export const metadata: Metadata = {
  title: '作者',
  description: '推荐作者',
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

const size = 12;

export default async function PageAuthor({
  searchParams,
}: PageProps) {
  const {
    page = '1',
  } = await searchParams;

  const data: {
    count: number;
    list: Account[];
  } = await author.getAuthors({
    posts: 1,
    page: Number(page),
    size,
  })

  return (
    <Authors
        { ...data }
        page={ Number(page) }
        size={ size } />
  );
}
