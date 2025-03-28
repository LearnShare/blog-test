import AuthorCheck from '../author-check';
import Posts from './posts';

export default async function PagePosts() {
  return (
    <AuthorCheck>
      <Posts />
    </AuthorCheck>
  );
}
