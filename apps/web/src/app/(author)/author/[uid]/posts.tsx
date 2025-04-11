import PostCard from '@/components/post/card';
import SimplePagination from '@/components/pagination/simple';
import Empty from '@/components/empty';

import type {
  Post,
} from '@/types/post';

interface PostsProps {
  count?: number;
  list?: Post[];
  page?: number;
  size?: number;
}

function Posts({
  count = 0,
  list = [],
  page = 1,
  size = 12
}: PostsProps) {
  return (
    <section>
      <h2 className="text-xl my-4">最近更新</h2>
      <div className="flex flex-wrap gap-6
          *:w-full">
        {
          list.map((post: Post) => (
            <PostCard
                key={ post.id }
                { ...post } />
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
    </section>
  );
}

export default Posts;
