import DraftView from './view';

export default async function PageDraft({
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
    <DraftView uid={ uid } />
  );
}
