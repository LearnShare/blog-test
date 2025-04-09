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
  data?: Post;
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

  if (!data) {
    return null;
  }

  return (
    <>
      <div
          className={ cn(
            'group flex flex-col cursor-pointer max-w-[360px] overflow-hidden',
            className,
          ) }
          onClick={ () => setDialogOpen(true) }>
        <div className="text-slate-700 truncate">{ data.title }</div>
        <div className="text-sm text-slate-500 truncate group-hover:underline">{ data.uid }</div>
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
