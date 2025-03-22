import HomeLayout from '@/components/page/home';
import Posts from './posts';

export default function PageHome() {
  return (
    <HomeLayout>
      <section>
        <h2 className="text-xl my-4">最近更新</h2>
        <Posts />
      </section>
    </HomeLayout>
  );
}
