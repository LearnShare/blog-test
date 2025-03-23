import HomeLayout from '@/components/page/home';
import AuthorCheck from './author-check';

export default function MineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HomeLayout>
      <AuthorCheck>
        { children }
      </AuthorCheck>
    </HomeLayout>
  );
}
