import HomeLayout from '@/components/page/home';
import PostDetail from '@/components/post/detail';

import {
  post,
} from '@packages/lib/sdk/web';

export default async function PagePost({
  params,
}: {
  params: Promise<{
    uid: string;
  }>
}) {
  const {
    uid,
  } = await params;
  const data = await post.get(uid);

  return (
    <HomeLayout>
      <section className="flex-1">
        <PostDetail
            { ...data } />
      </section>
    </HomeLayout>
  );
}
