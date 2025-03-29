import AuthorCheck from '../../author-check';
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
    <AuthorCheck>
      <DraftView uid={ uid } />
    </AuthorCheck>
  );
}
