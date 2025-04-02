import type { Metadata } from 'next';
import HomeLayout from '@/components/page/home';

export const metadata: Metadata = {
  title: '关于',
  description: '关于 BLOG 项目',
};

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
