import {
  useState,
} from 'react';

import PostDialog from './dialog';

import {
  cn,
} from '@/lib/utils';
import type {
  Post,
} from '@/types';

interface PostCardProps {
  data: Post;
  className?: string;
}

function PostCard({
  data,
  className,
}: PostCardProps) {
  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  return (
    <>
      <div
          className={ cn(
            'group flex flex-col cursor-pointer',
            className,
          ) }
          onClick={ () => setDialogOpen(true) }>
        <div className="text-slate-700">{ data.title }</div>
        <div className="text-sm text-slate-500 group-hover:underline">{ data.uid }</div>
      </div>

      <PostDialog
          open={ dialogOpen }
          data={ data }
          onClose={ () => setDialogOpen(false) } />
    </>
  );
}

export default PostCard;
