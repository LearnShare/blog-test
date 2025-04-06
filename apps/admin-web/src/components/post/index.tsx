import {
  useState,
} from 'react';

import PostDialog from './dialog';

import {
  cn,
} from '@/lib/utils';
import type {
  Post,
  Ticket,
} from '@/types';

interface PostCardProps {
  data: Post;
  ticket?: Ticket;
  refresh?: () => void;
  className?: string;
}

function PostCard({
  data,
  ticket,
  refresh,
  className,
}: PostCardProps) {
  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const dialogOnClose = (updated: boolean) => {
    if (updated) {
      refresh?.();
    }

    setDialogOpen(false);
  };

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
          ticket={ ticket }
          onClose={ (updated: boolean) => dialogOnClose(updated) } />
    </>
  );
}

export default PostCard;
