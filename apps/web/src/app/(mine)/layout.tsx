import HomeLayout from '@/components/page/home';

export default function MineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HomeLayout>
      { children }
    </HomeLayout>
  );
}
