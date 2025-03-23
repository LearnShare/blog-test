import AuthLayout from '@/components/page/auth';

export default function MineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthLayout>
      { children }
    </AuthLayout>
  );
}
