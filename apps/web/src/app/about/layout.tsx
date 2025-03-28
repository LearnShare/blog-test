import HomeLayout from '@/components/page/home';

export default function AboutLayout({
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
