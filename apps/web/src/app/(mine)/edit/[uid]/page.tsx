import HomeLayout from '@/components/page/home';
import EditView from './view';

export default async function PageEdit({
  params,
}: {
  params: Promise<{
    uid: string;
  }>
}) {
  const {
    uid,
  } = await params;

  return (
    <HomeLayout>
      <EditView uid={ uid } />
    </HomeLayout>
  );
}
