import HomeLayout from '@/components/page/home';
import Posts from './posts';

import {
  post,
} from '@packages/lib/sdk/web';
import type {
  Post,
} from '@/types/post';
import type {
  Account,
} from '@/types/account';

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

const size = 12;

export default async function PageHome({
  searchParams,
}: PageProps) {
  const {
    page = '1',
  } = await searchParams;

  const data: {
    count: number;
    list: Post[];
    accounts: Record<number, Account>;
  } = await post.getPosts({
    page: Number(page),
    size,
    sort: '-utime',
    account: 1,
  });

  return (
    <HomeLayout>
      <section>
        <h2 className="text-xl my-4">最近更新</h2>
        <Posts
            { ...data }
            page={ Number(page) }
            size={ size } />
      </section>
    </HomeLayout>
  );
}
