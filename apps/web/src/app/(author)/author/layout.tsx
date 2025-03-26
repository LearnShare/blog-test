import HomeLayout from '@/components/page/home';

export default function AuthorLayout({
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
