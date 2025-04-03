import HomeLayout from '@/components/page/home';
import AuthCheck from './auth-check';

export default function MineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HomeLayout>
      <AuthCheck>
        { children }
      </AuthCheck>
    </HomeLayout>
  );
}
