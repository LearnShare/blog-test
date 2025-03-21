import HomeLayout from '@/components/page/home';
import Posts from './posts';

export default async function PagePosts() {
  return (
    <HomeLayout>
      <Posts />
    </HomeLayout>
  );
}
