import PostCard from '@/components/post/card';
import Empty from '@/components/empty';
import SimplePagination from '@/components/pagination/simple';

import type {
  Post,
} from '@/types/post';
import {
  post,
} from '@packages/lib/sdk/web';
import type { Account } from '@/types/account';

const size = 12;


async function Posts({
  page = 1,
}: {
  page?: number;
}) {
  const data: {
    count: number;
    list: Post[];
    accounts: Record<number, Account>;
  } = await post.getPosts({
    page: Number(page),
    size,
    account: 1,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6
          *:w-full md:*:max-w-[calc(50%-12px)]">
        {
          data?.list.map((post: Post) => (
            <PostCard
                key={ post.id }
                { ...post }
                author={ data?.accounts[post.authorId] } />
          ))
        }
      </div>
      <SimplePagination
          page={ page }
          size={ size }
          total={ data?.count } />
      {
        !data?.count && (
          <Empty />
        )
      }
    </div>
  );
}

export default Posts;
