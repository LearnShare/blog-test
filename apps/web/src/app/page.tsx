import HomeLayout from '@/components/page/home';
import Posts from './posts';

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function PageHome({
  searchParams,
}: PageProps) {
  const {
    page = '1',
  } = await searchParams;

  return (
    <HomeLayout>
      <section>
        <h2 className="text-xl my-4">最近更新</h2>
        <Posts
            page={ Number(page) } />
      </section>
    </HomeLayout>
  );
}
