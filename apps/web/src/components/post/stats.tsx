import React from 'react';
import {
  Eye as IconEye,
} from 'lucide-react';

import Bookmark from './actions/bookmark';

interface PostStatsProps {
  id: number;
  views: number;
  bookmarks: number;
  bookmarked?: boolean;
}

function PostStats({
  id,
  views,
  bookmarks,
  bookmarked,
}: PostStatsProps) {
  return (
    <div className="flex gap-2 select-none">
      <div className="min-w-[44px] h-[44px] flex flex-col items-center justify-center text-gray-400">
        <IconEye size={ 20 } />
        <span className="text-sm">{ views || 0 }</span>
      </div>
      <Bookmark
          id={ id }
          bookmarks={ bookmarks }
          bookmarked={ bookmarked } />
    </div>
  );
}

export default PostStats;
